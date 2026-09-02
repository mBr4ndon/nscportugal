import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getRegistrationExportRows } from "@/lib/dashboard";

const headers = [
  "Referência", "Estado", "Criada em", "Confirmada em", "Email", "Telefone",
  "Estado de vida", "Tipo", "Rota", "Afiliação", "Idioma", "Autoriza imagem",
  "Subtotal (€)", "Desconto família (€)", "Desconto promocional (€)", "Base (€)",
  "Extras (€)", "Donativo (€)", "Total (€)", "Código desconto", "Método pagamento",
  "Estado pagamento", "Transação", "Pago em", "Participantes", "Serviços",
];

function escapeCsv(value: unknown) {
  const raw = value === null || value === undefined ? "" : String(value);
  const text = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return `"${text.replaceAll('"', '""')}"`;
}

function euros(value: unknown) {
  return (Number(value ?? 0) / 100).toFixed(2).replace(".", ",");
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const rows = await getRegistrationExportRows();
  const lines = rows.map((row) => [
    row.public_code, row.status, row.created_at, row.confirmed_at, row.contact_email,
    row.contact_phone, row.life_state, row.registration_type, row.route,
    row.affiliation_name, row.locale, row.image_authorized ? "Sim" : "Não",
    euros(row.subtotal_amount_cents), euros(row.family_discount_cents),
    euros(row.promo_discount_cents), euros(row.base_amount_cents),
    euros(row.extras_amount_cents), euros(row.donation_amount_cents),
    euros(row.total_amount_cents), row.discount_code, row.payment_method,
    row.payment_status, row.provider_transaction_id, row.paid_at,
    row.participants, row.services,
  ].map(escapeCsv).join(";"));
  const csv = `\uFEFF${headers.map(escapeCsv).join(";")}\n${lines.join("\n")}`;
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="inscricoes-nsc-${date}.csv"`,
      "cache-control": "private, no-store",
    },
  });
}
