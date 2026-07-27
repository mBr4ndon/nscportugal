import { getDb } from "@/lib/db";
import { PRECO_SERVICO_CENTIMOS, type InscricaoData } from "@/types/inscricao";
import type { CalculoInscricao } from "@/lib/pricing";
import type { CodigoDesconto } from "@/lib/discounts";

export type EstadoInscricao = "pending_payment" | "confirmed" | "cancelled" | "expired";
export type EstadoPagamento = "created" | "pending" | "paid" | "failed" | "expired" | "refunded";

export interface ResumoPagamento {
  orderId: string;
  ticketToken: string;
  estadoInscricao: EstadoInscricao;
  estadoPagamento: EstadoPagamento;
  totalCentimos: number;
}

export interface PagamentoStripePendente {
  orderId: string;
  sessionId: string;
  checkoutUrl: string | null;
}

export interface NovaInscricao {
  orderId: string;
  dados: InscricaoData;
  calculo: CalculoInscricao;
  estado: EstadoInscricao;
  metodoPagamento: "stripe" | "manual" | "exempt";
  codigoDesconto: CodigoDesconto | null;
}

const serviceEntries = [
  ["dormidaNazare", "dormida_nazare"],
  ["dormidaFatima", "dormida_fatima"],
  ["transporteNazare", "transporte_nazare"],
] as const;

export async function guardarInscricao(nova: NovaInscricao): Promise<string> {
  const db = getDb();
  const { dados, calculo } = nova;
  const participantes = [
    { nome: dados.nome, apelido: dados.apelido, dataNascimento: dados.dataNascimento, nacionalidade: dados.nacionalidade, servicos: dados.servicos, role: "primary" },
    ...dados.membrosFamilia.map((m) => ({ ...m, role: "family_member" })),
  ];

  return db.begin(async (tx) => {
    if (nova.codigoDesconto) {
      const [code] = await tx`
        SELECT id, active, valid_from, valid_until, max_redemptions,
               discount_type, percentage, fixed_amount_cents
        FROM discount_codes
        WHERE id = ${nova.codigoDesconto.id}
        FOR UPDATE
      `;
      const now = new Date();
      const outsideValidity = !code
        || !code.active
        || (code.valid_from && new Date(code.valid_from) > now)
        || (code.valid_until && new Date(code.valid_until) < now);
      if (outsideValidity) throw new Error("CODIGO_DESCONTO_INVALIDO");
      const currentValue = code.discount_type === "fixed"
        ? Number(code.fixed_amount_cents)
        : Number(code.percentage);
      if (code.discount_type !== nova.codigoDesconto.type || currentValue !== nova.codigoDesconto.value) {
        throw new Error("CODIGO_DESCONTO_INVALIDO");
      }

      if (code.max_redemptions !== null) {
        const [usage] = await tx`
          SELECT count(*)::int AS count
          FROM registrations
          WHERE discount_code_id = ${code.id}
            AND status IN ('pending_payment', 'confirmed')
        `;
        if (usage.count >= code.max_redemptions) {
          throw new Error("CODIGO_DESCONTO_INVALIDO");
        }
      }
    }

    const [registration] = await tx`
      INSERT INTO registrations (
        public_code, status, life_state, registration_type, route,
        contact_email, contact_phone, affiliation_name,
        family_cap_type, subtotal_amount_cents, family_discount_cents, base_amount_cents,
        discount_code_id, promo_discount_cents, extras_amount_cents,
        donation_amount_cents, total_amount_cents, locale, terms_accepted_at,
        privacy_accepted_at, image_authorized, confirmed_at
      ) VALUES (
        ${nova.orderId}, ${nova.estado}, ${dados.estadoVida}, ${dados.tipoInscricao}, ${calculo.rota},
        ${dados.email}, ${dados.telefone}, ${dados.afiliacaoNome ?? null},
        ${dados.tipoInscricao === "familia" ? (dados.nacionalidade === "PT" ? "nacional" : "internacional") : null},
        ${calculo.subtotalCentimos}, ${calculo.descontoFamiliaCentimos}, ${calculo.baseCentimos},
        ${nova.codigoDesconto?.id ?? null}, ${calculo.descontoPromocionalCentimos},
        ${calculo.extrasCentimos}, ${calculo.donativoCentimos},
        ${calculo.totalCentimos}, ${dados.locale}, now(), now(),
        ${dados.autorizaImagem}, ${nova.estado === "confirmed" ? new Date() : null}
      ) RETURNING id, ticket_token
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
          const precoServico = participante.role === "primary" && dados.estadoVida === "sacerdote"
            ? 0
            : PRECO_SERVICO_CENTIMOS;
          await tx`
            INSERT INTO registration_services (
              registration_id, participant_id, service_code, unit_amount_cents
            ) VALUES (${registration.id}, ${created.id}, ${code}, ${precoServico})
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
    return registration.ticket_token;
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

export async function obterPagamentoStripePendentePorEmail(
  email: string,
): Promise<PagamentoStripePendente | null> {
  const db = getDb();
  const [row] = await db`
    SELECT
      r.public_code,
      p.provider_order_id,
      p.provider_payload->>'checkoutUrl' AS checkout_url
    FROM registrations r
    JOIN payments p ON p.registration_id = r.id
    WHERE lower(r.contact_email) = lower(${email})
      AND r.status = 'pending_payment'
      AND p.method = 'stripe'
      AND p.status IN ('created', 'pending')
    ORDER BY r.created_at DESC
    LIMIT 1
  `;
  if (!row) return null;
  return {
    orderId: row.public_code,
    sessionId: row.provider_order_id,
    checkoutUrl: row.checkout_url ?? null,
  };
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

export async function confirmarPagamento(
  orderId: string,
  amountCents?: number,
  transactionId?: string | null,
  payload?: unknown,
): Promise<boolean> {
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
    await tx`
      UPDATE payments SET
        status = 'paid',
        provider_transaction_id = COALESCE(${transactionId ?? null}, provider_transaction_id),
        provider_payload = COALESCE(${payload ? JSON.stringify(payload) : null}::jsonb, provider_payload),
        paid_at = now(),
        updated_at = now()
      WHERE id = ${payment.id}
    `;
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
    await tx`
      UPDATE payments SET status = 'failed', updated_at = now()
      WHERE id = ${payment.id} AND status NOT IN ('paid', 'refunded')
    `;
    await tx`
      UPDATE registrations SET status = 'cancelled', updated_at = now()
      WHERE id = ${payment.registration_id}
        AND status IN ('pending_payment', 'expired')
    `;
  });
}

export async function expirarPagamento(providerOrderId: string): Promise<void> {
  const db = getDb();
  await db.begin(async (tx) => {
    const [payment] = await tx`
      UPDATE payments p SET status = 'expired', updated_at = now()
      FROM registrations r
      WHERE p.registration_id = r.id
        AND p.provider_order_id = ${providerOrderId}
        AND p.status NOT IN ('paid', 'refunded')
        AND r.status = 'pending_payment'
      RETURNING p.registration_id
    `;
    if (payment) {
      await tx`
        UPDATE registrations SET status = 'expired', updated_at = now()
        WHERE id = ${payment.registration_id} AND status = 'pending_payment'
      `;
    }
  });
}

export async function falharPagamento(providerOrderId: string, payload?: unknown): Promise<void> {
  const db = getDb();
  await db.begin(async (tx) => {
    const [payment] = await tx`
      UPDATE payments SET
        status = 'failed',
        provider_payload = COALESCE(${payload ? JSON.stringify(payload) : null}::jsonb, provider_payload),
        updated_at = now()
      WHERE provider_order_id = ${providerOrderId} AND status NOT IN ('paid', 'refunded')
      RETURNING registration_id
    `;
    if (payment) {
      await tx`
        UPDATE registrations SET status = 'cancelled', updated_at = now()
        WHERE id = ${payment.registration_id} AND status = 'pending_payment'
      `;
    }
  });
}

export async function obterResumoPagamento(providerOrderId: string): Promise<ResumoPagamento | null> {
  const db = getDb();
  const [row] = await db`
    SELECT
      r.public_code,
      r.ticket_token,
      r.status AS registration_status,
      p.status AS payment_status,
      p.amount_cents
    FROM payments p
    JOIN registrations r ON r.id = p.registration_id
    WHERE p.provider_order_id = ${providerOrderId}
  `;
  if (!row) return null;
  return {
    orderId: row.public_code,
    ticketToken: row.ticket_token,
    estadoInscricao: row.registration_status,
    estadoPagamento: row.payment_status,
    totalCentimos: row.amount_cents,
  };
}

export interface ParticipanteBilhete {
  nome: string;
  apelido: string;
  dataNascimento: string;
  nacionalidade: string;
  principal: boolean;
  servicos: string[];
}

export interface DadosBilhete {
  referencia: string;
  token: string;
  locale: string;
  estadoVida: string;
  tipoInscricao: string;
  rota: string;
  email: string;
  telefone: string;
  afiliacao: string | null;
  totalCentimos: number;
  confirmadoEm: string;
  participantes: ParticipanteBilhete[];
}

function normalizarDataSql(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = String(value);
  const isoDate = text.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (!isoDate) throw new Error("Data de nascimento inválida na base de dados");
  return isoDate;
}

export async function obterDadosBilhete(token: string): Promise<DadosBilhete | null> {
  const db = getDb();
  const [registration] = await db`
    SELECT
      r.id, r.public_code, r.ticket_token, r.locale, r.life_state,
      r.registration_type, r.route, r.contact_email, r.contact_phone,
      r.affiliation_name, r.total_amount_cents, r.confirmed_at
    FROM registrations r
    JOIN payments pay ON pay.registration_id = r.id
    WHERE r.ticket_token = ${token}
      AND r.status = 'confirmed'
      AND pay.status = 'paid'
  `;
  if (!registration) return null;

  const participants = await db`
    SELECT
      p.id, p.first_name, p.last_name, p.birth_date, p.nationality_code, p.role,
      COALESCE(
        array_agg(rs.service_code ORDER BY rs.service_code)
          FILTER (WHERE rs.service_code IS NOT NULL),
        ARRAY[]::varchar[]
      ) AS services
    FROM participants p
    LEFT JOIN registration_services rs ON rs.participant_id = p.id
    WHERE p.registration_id = ${registration.id}
    GROUP BY p.id
    ORDER BY CASE WHEN p.role = 'primary' THEN 0 ELSE 1 END, p.created_at
  `;

  return {
    referencia: registration.public_code,
    token: registration.ticket_token,
    locale: registration.locale,
    estadoVida: registration.life_state,
    tipoInscricao: registration.registration_type,
    rota: registration.route,
    email: registration.contact_email,
    telefone: registration.contact_phone,
    afiliacao: registration.affiliation_name,
    totalCentimos: registration.total_amount_cents,
    confirmadoEm: new Date(registration.confirmed_at).toISOString(),
    participantes: participants.map((participant) => ({
      nome: participant.first_name,
      apelido: participant.last_name,
      dataNascimento: normalizarDataSql(participant.birth_date),
      nacionalidade: participant.nationality_code,
      principal: participant.role === "primary",
      servicos: participant.services,
    })),
  };
}

export async function obterStripeSessionId(orderId: string): Promise<string | null> {
  const db = getDb();
  const [row] = await db`
    SELECT p.provider_order_id
    FROM payments p
    JOIN registrations r ON r.id = p.registration_id
    WHERE r.public_code = ${orderId}
      AND p.provider = 'stripe'
      AND p.status IN ('created', 'pending')
  `;
  return row?.provider_order_id ?? null;
}
