import { getDb } from "@/lib/db";

export type TipoCodigoDesconto = "percentage" | "fixed";

export interface CodigoDesconto {
  id: string;
  code: string;
  type: TipoCodigoDesconto;
  value: number;
}

export function normalizarCodigoDesconto(code: string): string {
  return code.trim().toUpperCase();
}

export async function obterCodigoDesconto(code: string): Promise<CodigoDesconto | null> {
  const normalized = normalizarCodigoDesconto(code);
  if (!normalized) return null;

  const db = getDb();
  const [row] = await db`
    SELECT dc.id, dc.code, dc.discount_type, dc.percentage, dc.fixed_amount_cents
    FROM discount_codes dc
    WHERE upper(dc.code) = ${normalized}
      AND dc.active = true
      AND (dc.valid_from IS NULL OR dc.valid_from <= now())
      AND (dc.valid_until IS NULL OR dc.valid_until >= now())
      AND (
        dc.max_redemptions IS NULL
        OR (
          SELECT count(*)
          FROM registrations r
          WHERE r.discount_code_id = dc.id
            AND r.status IN ('pending_payment', 'confirmed')
        ) < dc.max_redemptions
      )
  `;

  if (!row) return null;
  return {
    id: row.id,
    code: normalizarCodigoDesconto(row.code),
    type: row.discount_type,
    value: row.discount_type === "fixed"
      ? Number(row.fixed_amount_cents)
      : Number(row.percentage),
  };
}
