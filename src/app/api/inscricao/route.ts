import { NextRequest, NextResponse } from "next/server";
import { inscricaoSchema } from "@/types/inscricao";
import { calcularInscricao } from "@/lib/pricing";
import { gerarOrderId } from "@/lib/order-id";
import { associarStripeSession, cancelarInscricao, guardarInscricao } from "@/lib/storage";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  let orderId: string | undefined;
  try {
    const parsed = inscricaoSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, erro: "Dados inválidos", detalhes: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const dados = parsed.data;
    const calculo = calcularInscricao(dados);
    orderId = gerarOrderId();
    const isento = calculo.totalCentimos === 0;
    const pagamentosAtivos = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";

    await guardarInscricao({
      orderId,
      dados,
      calculo,
      estado: isento ? "confirmed" : "pending_payment",
      metodoPagamento: isento ? "exempt" : pagamentosAtivos ? "stripe" : "manual",
    });

    if (isento) {
      return NextResponse.json({
        ok: true,
        orderId,
        metodoPagamento: "isento",
        totalCentimos: 0,
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
      payment_intent_data: { metadata: { orderId } },
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: calculo.totalCentimos,
          product_data: {
            name: "Inscrição — Peregrinação NSC 2026",
            description: `${calculo.participantes.length} participante(s) · Rota ${calculo.rota}`,
          },
        },
      }],
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
