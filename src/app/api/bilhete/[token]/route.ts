import { NextRequest, NextResponse } from "next/server";
import { obterDadosBilhete } from "@/lib/storage";
import { gerarBilhetePdf } from "@/lib/ticket-pdf";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(token)) {
    return NextResponse.json({ erro: "Bilhete inválido" }, { status: 404 });
  }

  const ticket = await obterDadosBilhete(token);
  if (!ticket) {
    return NextResponse.json({ erro: "Bilhete não encontrado ou inscrição não confirmada" }, { status: 404 });
  }

  const pdf = await gerarBilhetePdf(ticket);
  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="bilhete-${ticket.referencia}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
