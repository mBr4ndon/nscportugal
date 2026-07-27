import { NextRequest, NextResponse } from "next/server";
import { obterCodigoDesconto } from "@/lib/discounts";
import { registrationsEnabled } from "@/lib/features";

export async function POST(req: NextRequest) {
  if (!registrationsEnabled()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const body = await req.json().catch(() => null) as { code?: unknown } | null;
  if (typeof body?.code !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const discount = await obterCodigoDesconto(body.code);
  if (!discount) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    code: discount.code,
    type: discount.type,
    value: discount.value,
  });
}
