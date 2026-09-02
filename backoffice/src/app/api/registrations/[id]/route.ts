import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getRegistrationDetail } from "@/lib/dashboard";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await context.params;
  const registration = await getRegistrationDetail(id);
  if (!registration) return NextResponse.json({ error: "Inscrição não encontrada" }, { status: 404 });
  return NextResponse.json(registration, {
    headers: { "cache-control": "private, no-store" },
  });
}
