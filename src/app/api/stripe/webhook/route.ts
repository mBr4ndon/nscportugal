import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { confirmarPagamento, expirarPagamento, falharPagamento } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json({ ok: false, erro: "Webhook Stripe não configurado" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await req.text(), signature, secret);
  } catch (error) {
    console.warn("[stripe/webhook] Assinatura inválida:", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object;
      if (session.payment_status === "paid") {
        const confirmado = await confirmarPagamento(
          session.id,
          session.amount_total ?? undefined,
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
          session,
        );
        if (!confirmado) return NextResponse.json({ ok: false, erro: "Inscrição não encontrada" }, { status: 404 });
      }
    } else if (event.type === "checkout.session.async_payment_failed") {
      await falharPagamento(event.data.object.id, event.data.object);
    } else if (event.type === "checkout.session.expired") {
      await expirarPagamento(event.data.object.id);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[stripe/webhook] Erro:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
