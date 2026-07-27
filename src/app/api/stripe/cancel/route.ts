import { NextRequest, NextResponse } from "next/server";
import { cancelarInscricao, confirmarPagamento, obterStripeSessionId } from "@/lib/storage";
import { routing } from "@/i18n/routing";
import { getStripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  const requestedLocale = req.nextUrl.searchParams.get("locale") ?? routing.defaultLocale;
  const locale = routing.locales.includes(requestedLocale as (typeof routing.locales)[number])
    ? requestedLocale
    : routing.defaultLocale;
  if (orderId) {
    const sessionId = await obterStripeSessionId(orderId);
    if (sessionId?.startsWith("cs_")) {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        await confirmarPagamento(
          session.id,
          session.amount_total ?? undefined,
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
          session,
        );
        return NextResponse.redirect(new URL(`/${locale}/sucesso?session_id=${encodeURIComponent(session.id)}`, req.url));
      }
      if (session.status === "open") {
        await stripe.checkout.sessions.expire(session.id);
      }
    }
    await cancelarInscricao(orderId);
  }
  return NextResponse.redirect(new URL(`/${locale}?pagamento=cancelado#inscricao`, req.url));
}
