import { NextRequest, NextResponse } from "next/server";
import { cancelarInscricao } from "@/lib/storage";
import { routing } from "@/i18n/routing";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  const requestedLocale = req.nextUrl.searchParams.get("locale") ?? routing.defaultLocale;
  const locale = routing.locales.includes(requestedLocale as (typeof routing.locales)[number])
    ? requestedLocale
    : routing.defaultLocale;
  if (orderId) await cancelarInscricao(orderId);
  return NextResponse.redirect(new URL(`/${locale}?pagamento=cancelado#inscricao`, req.url));
}
