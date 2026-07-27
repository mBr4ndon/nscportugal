import { NextRequest, NextResponse } from "next/server";
import { inscricaoSchema } from "@/types/inscricao";
import { calcularInscricao } from "@/lib/pricing";
import { gerarOrderId } from "@/lib/order-id";
import {
  associarStripeSession,
  cancelarInscricao,
  confirmarPagamento,
  expirarPagamento,
  guardarInscricao,
  obterPagamentoStripePendentePorEmail,
} from "@/lib/storage";
import { getStripe } from "@/lib/stripe";
import { registrationsEnabled } from "@/lib/features";
import { obterCodigoDesconto } from "@/lib/discounts";

export async function POST(req: NextRequest) {
  let orderId: string | undefined;
  try {
    if (!registrationsEnabled()) {
      return NextResponse.json(
        { ok: false, erro: "As inscrições ainda não estão abertas." },
        { status: 503 },
      );
    }

    const parsed = inscricaoSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, erro: "Dados inválidos", detalhes: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const dados = parsed.data;
    const pagamentosAtivos = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";

    if (pagamentosAtivos) {
      const pending = await obterPagamentoStripePendentePorEmail(dados.email);
      if (pending?.sessionId.startsWith("cs_")) {
        const session = await getStripe().checkout.sessions.retrieve(pending.sessionId);
        if (session.payment_status === "paid") {
          await confirmarPagamento(
            session.id,
            session.amount_total ?? undefined,
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id,
            session,
          );
          return NextResponse.json({
            ok: true,
            orderId: pending.orderId,
            metodoPagamento: "stripe",
            checkoutUrl: `/${dados.locale}/sucesso?session_id=${encodeURIComponent(session.id)}`,
          });
        }
        if (session.status === "open" && session.url) {
          return NextResponse.json({
            ok: true,
            orderId: pending.orderId,
            metodoPagamento: "stripe",
            checkoutUrl: session.url,
            resumed: true,
            mensagem: "Já existe um pagamento iniciado para esta inscrição.",
          });
        }
        if (session.status === "complete") {
          return NextResponse.json({
            ok: true,
            orderId: pending.orderId,
            metodoPagamento: "stripe",
            checkoutUrl: `/${dados.locale}/sucesso?session_id=${encodeURIComponent(session.id)}`,
          });
        }
        await expirarPagamento(session.id);
      }
    }

    const codigoDesconto = dados.codigoDesconto
      ? await obterCodigoDesconto(dados.codigoDesconto)
      : null;
    if (dados.codigoDesconto && !codigoDesconto) {
      return NextResponse.json(
        {
          ok: false,
          errorCode: "INVALID_DISCOUNT_CODE",
          erro: "Código de desconto inválido ou indisponível.",
        },
        { status: 400 },
      );
    }
    const calculo = calcularInscricao(
      dados,
      new Date(),
      codigoDesconto ? { type: codigoDesconto.type, value: codigoDesconto.value } : null,
    );
    orderId = gerarOrderId();
    const isento = calculo.totalCentimos === 0;

    const ticketToken = await guardarInscricao({
      orderId,
      dados,
      calculo,
      estado: isento ? "confirmed" : "pending_payment",
      metodoPagamento: isento ? "exempt" : pagamentosAtivos ? "stripe" : "manual",
      codigoDesconto,
    });

    if (isento) {
      return NextResponse.json({
        ok: true,
        orderId,
        metodoPagamento: "isento",
        totalCentimos: 0,
        ticketUrl: `/api/bilhete/${ticketToken}`,
        mensagem: "Inscrição confirmada. Receberá confirmação por correio electrónico.",
      });
    }

    if (!pagamentosAtivos) {
      return NextResponse.json({
        ok: true,
        orderId,
        metodoPagamento: "manual",
        totalCentimos: calculo.totalCentimos,
        mensagem: "Inscrição registada. O pagamento ficará disponível posteriormente.",
      });
    }

    const origin = req.nextUrl.origin;
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "mb_way"],
      customer_email: dados.email,
      client_reference_id: orderId,
      metadata: { orderId },
      payment_intent_data: {
        metadata: { orderId },
        receipt_email: dados.email,
        description: `Inscrição ${orderId} — Peregrinação NSC 2026`,
      },
      line_items: [
        ...(calculo.totalSemDonativoCentimos > 0 ? [{
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: calculo.totalSemDonativoCentimos,
            product_data: {
              name: "Inscrição — Peregrinação NSC 2026",
              description: `${calculo.participantes.length} participante(s) · Rota ${calculo.rota}`,
            },
          },
        }] : []),
        ...(calculo.donativoCentimos > 0 ? [{
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: calculo.donativoCentimos,
            product_data: {
              name: "Donativo — Peregrinação NSC 2026",
            },
          },
        }] : []),
      ],
      success_url: `${origin}/${dados.locale}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/api/stripe/cancel?orderId=${encodeURIComponent(orderId)}&locale=${encodeURIComponent(dados.locale)}`,
    });

    if (!session.url) throw new Error("A Stripe não devolveu o endereço de pagamento");
    await associarStripeSession(orderId, { id: session.id, url: session.url, expiresAt: session.expires_at });

    return NextResponse.json({
      ok: true,
      orderId,
      totalCentimos: calculo.totalCentimos,
      metodoPagamento: "stripe",
      checkoutUrl: session.url,
    });
  } catch (error) {
    if (orderId) await cancelarInscricao(orderId).catch(console.error);
    const dbError = error as { code?: string; message?: string; type?: string };
    if (dbError.message === "CODIGO_DESCONTO_INVALIDO") {
      return NextResponse.json(
        {
          ok: false,
          errorCode: "INVALID_DISCOUNT_CODE",
          erro: "Código de desconto inválido ou já utilizado.",
        },
        { status: 400 },
      );
    }
    if (dbError.code === "23505") {
      return NextResponse.json(
        { ok: false, erro: "Já existe uma inscrição activa associada a este correio electrónico." },
        { status: 409 },
      );
    }
    console.error("[/api/inscricao] Erro:", error);
    return NextResponse.json(
      { ok: false, erro: dbError.message === "STRIPE_SECRET_KEY não configurada" ? "Pagamento Stripe ainda não configurado." : "Erro interno. Tente novamente." },
      { status: 500 },
    );
  }
}
