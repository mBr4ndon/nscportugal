import { getDb } from "@/lib/db";
import { PRECO_SERVICO_CENTIMOS, type InscricaoData } from "@/types/inscricao";
import type { CalculoInscricao } from "@/lib/pricing";

export type EstadoInscricao = "pending_payment" | "confirmed" | "cancelled" | "expired";
export type EstadoPagamento = "created" | "pending" | "paid" | "failed" | "expired" | "refunded";

export interface NovaInscricao {
  orderId: string;
  dados: InscricaoData;
  calculo: CalculoInscricao;
  estado: EstadoInscricao;
  metodoPagamento: "stripe" | "manual" | "exempt";
}

const serviceEntries = [
  ["dormidaNazare", "dormida_nazare"],
  ["dormidaFatima", "dormida_fatima"],
  ["transporteNazare", "transporte_nazare"],
] as const;

export async function guardarInscricao(nova: NovaInscricao): Promise<void> {
  const db = getDb();
  const { dados, calculo } = nova;
  const participantes = [
    { nome: dados.nome, apelido: dados.apelido, dataNascimento: dados.dataNascimento, nacionalidade: dados.nacionalidade, servicos: dados.servicos, role: "primary" },
    ...dados.membrosFamilia.map((m) => ({ ...m, role: "family_member" })),
  ];

  await db.begin(async (tx) => {
    const [registration] = await tx`
      INSERT INTO registrations (
        public_code, status, life_state, registration_type, route,
        contact_email, contact_phone, address, postal_code, city,
        emergency_contact_name, emergency_contact_phone, affiliation_type, affiliation_name,
        family_cap_type, subtotal_amount_cents, family_discount_cents, base_amount_cents,
        extras_amount_cents, total_amount_cents, locale, terms_accepted_at,
        privacy_accepted_at, image_authorized, confirmed_at
      ) VALUES (
        ${nova.orderId}, ${nova.estado}, ${dados.estadoVida}, ${dados.tipoInscricao}, ${calculo.rota},
        ${dados.email}, ${dados.telefone}, ${dados.morada}, ${dados.codigoPostal}, ${dados.localidade},
        ${dados.contactoEmergenciaNome}, ${dados.contactoEmergenciaTelefone},
        ${dados.afiliacaoTipo ?? null}, ${dados.afiliacaoNome ?? null},
        ${dados.tipoInscricao === "familia" ? (dados.nacionalidade === "PT" ? "nacional" : "internacional") : null},
        ${calculo.subtotalCentimos}, ${calculo.descontoFamiliaCentimos}, ${calculo.baseCentimos},
        ${calculo.extrasCentimos}, ${calculo.totalCentimos}, ${dados.locale}, now(), now(),
        ${dados.autorizaImagem}, ${nova.estado === "confirmed" ? new Date() : null}
      ) RETURNING id
    `;

    for (let i = 0; i < participantes.length; i++) {
      const participante = participantes[i];
      const linha = calculo.participantes[i];
      const [created] = await tx`
        INSERT INTO participants (
          registration_id, role, first_name, last_name, birth_date,
          age_at_registration, nationality_code, individual_price_cents
        ) VALUES (
          ${registration.id}, ${participante.role}, ${participante.nome}, ${participante.apelido},
          ${participante.dataNascimento}, ${linha.idade}, ${participante.nacionalidade},
          ${linha.precoIndividualCentimos}
        ) RETURNING id
      `;
      for (const [field, code] of serviceEntries) {
        if (participante.servicos[field]) {
          await tx`
            INSERT INTO registration_services (
              registration_id, participant_id, service_code, unit_amount_cents
            ) VALUES (${registration.id}, ${created.id}, ${code}, ${PRECO_SERVICO_CENTIMOS})
          `;
        }
      }
    }

    await tx`
      INSERT INTO payments (
        registration_id, provider, method, status, provider_order_id, amount_cents
      ) VALUES (
        ${registration.id}, ${nova.metodoPagamento === "stripe" ? "stripe" : "internal"}, ${nova.metodoPagamento},
        ${nova.metodoPagamento === "exempt" ? "paid" : "created"},
        ${nova.orderId}, ${calculo.totalCentimos}
      )
    `;
  });
}

export async function associarStripeSession(
  orderId: string,
  session: { id: string; url: string | null; expiresAt: number },
): Promise<void> {
  const db = getDb();
  await db`
    UPDATE payments SET
      provider = 'stripe',
      method = 'stripe',
      status = 'pending',
      provider_order_id = ${session.id},
      expires_at = ${new Date(session.expiresAt * 1000)},
      provider_payload = ${JSON.stringify({ checkoutUrl: session.url })}::jsonb,
      updated_at = now()
    WHERE provider_order_id = ${orderId}
  `;
}

export async function atualizarPagamento(
  orderId: string,
  values: {
    estado: EstadoPagamento;
    transactionId?: string;
    entidade?: string;
    referencia?: string;
    expiraEm?: string;
    payload?: unknown;
  },
): Promise<void> {
  const db = getDb();
  await db`
    UPDATE payments SET
      status = ${values.estado},
      provider_transaction_id = COALESCE(${values.transactionId ?? null}, provider_transaction_id),
      entity = COALESCE(${values.entidade ?? null}, entity),
      reference = COALESCE(${values.referencia ?? null}, reference),
      expires_at = COALESCE(${values.expiraEm ?? null}, expires_at),
      provider_payload = COALESCE(${values.payload ? JSON.stringify(values.payload) : null}::jsonb, provider_payload),
      updated_at = now()
    WHERE provider_order_id = ${orderId}
  `;
}

export async function confirmarPagamento(orderId: string, amountCents?: number): Promise<boolean> {
  const db = getDb();
  return db.begin(async (tx) => {
    const [payment] = await tx`
      SELECT id, registration_id, amount_cents, status
      FROM payments WHERE provider_order_id = ${orderId}
      FOR UPDATE
    `;
    if (!payment) return false;
    if (amountCents !== undefined && payment.amount_cents !== amountCents) {
      throw new Error("Montante do callback não corresponde à inscrição");
    }
    if (payment.status === "paid") return true;
    await tx`UPDATE payments SET status = 'paid', paid_at = now(), updated_at = now() WHERE id = ${payment.id}`;
    await tx`UPDATE registrations SET status = 'confirmed', confirmed_at = now(), updated_at = now() WHERE id = ${payment.registration_id}`;
    return true;
  });
}

export async function cancelarInscricao(orderId: string): Promise<void> {
  const db = getDb();
  await db.begin(async (tx) => {
    const [payment] = await tx`
      SELECT p.id, p.registration_id
      FROM payments p
      JOIN registrations r ON r.id = p.registration_id
      WHERE p.provider_order_id = ${orderId} OR r.public_code = ${orderId}
      FOR UPDATE
    `;
    if (!payment) return;
    await tx`UPDATE payments SET status = 'failed', updated_at = now() WHERE id = ${payment.id}`;
    await tx`
      UPDATE registrations SET status = 'cancelled', updated_at = now()
      WHERE id = ${payment.registration_id} AND status = 'pending_payment'
    `;
  });
}

export async function expirarPagamento(providerOrderId: string): Promise<void> {
  const db = getDb();
  await db.begin(async (tx) => {
    const [payment] = await tx`
      UPDATE payments SET status = 'expired', updated_at = now()
      WHERE provider_order_id = ${providerOrderId} AND status <> 'paid'
      RETURNING registration_id
    `;
    if (payment) {
      await tx`
        UPDATE registrations SET status = 'expired', updated_at = now()
        WHERE id = ${payment.registration_id} AND status = 'pending_payment'
      `;
    }
  });
}
