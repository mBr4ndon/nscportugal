import { NextResponse } from "next/server";
import {
  authIsConfigured,
  createSessionToken,
  passwordIsValid,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(request: Request) {
  if (!authIsConfigured()) {
    return NextResponse.json(
      { error: "O acesso ao backoffice ainda não está configurado." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!passwordIsValid(password)) {
    return NextResponse.json({ error: "Palavra-passe incorreta." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);
  return response;
}
