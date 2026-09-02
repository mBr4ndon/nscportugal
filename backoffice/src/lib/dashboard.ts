import { unstable_noStore as noStore } from "next/cache";
import { getDb } from "@/lib/db";
import type {
  BreakdownItem,
  DashboardData,
  FinanceMetrics,
  PaymentStatus,
  ParticipantDetail,
  RegistrationDetail,
  RegistrationSummary,
  ServiceMetric,
} from "@/lib/types";

const statusLabels: Record<string, string> = {
  confirmed: "Confirmadas",
  pending_payment: "A aguardar pagamento",
  cancelled: "Canceladas",
  expired: "Expiradas",
};

const routeLabels: Record<string, string> = {
  adultos: "Rota de adultos",
  familias: "Rota de famílias",
};

const lifeStateLabels: Record<string, string> = {
  leigo: "Leigos",
  sacerdote: "Sacerdotes",
  religioso: "Religiosos",
};

const registrationTypeLabels: Record<string, string> = {
  individual: "Individual",
  familia: "Família",
};

const serviceLabels: Record<string, string> = {
  dormida_nazare: "Dormida em Nazaré",
  dormida_fatima: "Dormida em Fátima",
  transporte_nazare: "Transporte de Nazaré",
};

const localeLabels: Record<string, string> = {
  pt: "Português",
  en: "Inglês",
  es: "Espanhol",
  fr: "Francês",
  it: "Italiano",
};

function number(value: unknown) {
  return Number(value ?? 0);
}

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return new Date(String(value)).toISOString();
}

function nullableIso(value: unknown): string | null {
  return value ? iso(value) : null;
}

function rowsToBreakdown(
  rows: readonly Record<string, unknown>[],
  labels: Record<string, string> = {},
): BreakdownItem[] {
  return rows.map((row) => {
    const key = String(row.key);
    return { key, label: labels[key] ?? key, value: number(row.value) };
  });
}

function splitCodes(value: unknown) {
  if (!value) return [];
  return String(value).split(",").filter(Boolean);
}

function mapRegistration(row: Record<string, unknown>): RegistrationSummary {
  return {
    id: String(row.id),
    publicCode: String(row.public_code),
    status: row.status as RegistrationSummary["status"],
    primaryName: String(row.primary_name ?? "Sem nome"),
    contactEmail: String(row.contact_email),
    contactPhone: String(row.contact_phone),
    lifeState: String(row.life_state),
    registrationType: String(row.registration_type),
    route: String(row.route),
    participantCount: number(row.participant_count),
    nationalities: splitCodes(row.nationalities),
    serviceCodes: splitCodes(row.service_codes),
    totalCents: number(row.total_amount_cents),
    donationCents: number(row.donation_amount_cents),
    paymentStatus: row.payment_status ? row.payment_status as RegistrationSummary["paymentStatus"] : null,
    paymentMethod: row.payment_method ? String(row.payment_method) : null,
    discountCode: row.discount_code ? String(row.discount_code) : null,
    locale: String(row.locale),
    imageAuthorized: Boolean(row.image_authorized),
    createdAt: iso(row.created_at),
    confirmedAt: nullableIso(row.confirmed_at),
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  noStore();
  const db = getDb();

  const [
    overviewRows,
    trendRows,
    statusRows,
    routeRows,
    lifeStateRows,
    registrationTypeRows,
    ageRows,
    countryRows,
    localeRows,
    serviceRows,
    financeRows,
    registrationRows,
  ] = await Promise.all([
    db`
      WITH registration_counts AS (
        SELECT r.*,
          (SELECT count(*)::int FROM participants p WHERE p.registration_id = r.id) AS participant_count
        FROM registrations r
      )
      SELECT
        count(*)::int AS total_registrations,
        count(*) FILTER (WHERE status = 'confirmed')::int AS confirmed_registrations,
        count(*) FILTER (WHERE status = 'pending_payment')::int AS pending_registrations,
        count(*) FILTER (WHERE status = 'cancelled')::int AS cancelled_registrations,
        count(*) FILTER (WHERE status = 'expired')::int AS expired_registrations,
        coalesce(sum(participant_count), 0)::int AS total_participants,
        coalesce(sum(participant_count) FILTER (WHERE status = 'confirmed'), 0)::int AS confirmed_participants,
        count(*) FILTER (WHERE created_at >= now() - interval '7 days')::int AS current_week_registrations,
        count(*) FILTER (WHERE created_at >= now() - interval '14 days' AND created_at < now() - interval '7 days')::int AS previous_week_registrations,
        coalesce(sum(participant_count) FILTER (WHERE created_at >= now() - interval '7 days'), 0)::int AS current_week_participants,
        coalesce(sum(participant_count) FILTER (WHERE created_at >= now() - interval '14 days' AND created_at < now() - interval '7 days'), 0)::int AS previous_week_participants,
        count(*) FILTER (WHERE status = 'confirmed' AND image_authorized)::int AS image_authorized_confirmed
      FROM registration_counts
    `,
    db`
      WITH days AS (
        SELECT generate_series(
          (current_date - interval '29 days')::date,
          current_date,
          interval '1 day'
        )::date AS day
      ), registrations_by_day AS (
        SELECT (r.created_at AT TIME ZONE 'Europe/Lisbon')::date AS day,
          count(*)::int AS registrations,
          coalesce(sum((SELECT count(*) FROM participants p WHERE p.registration_id = r.id)), 0)::int AS participants
        FROM registrations r
        WHERE r.created_at >= current_date - interval '29 days'
        GROUP BY 1
      ), revenue_by_day AS (
        SELECT (p.paid_at AT TIME ZONE 'Europe/Lisbon')::date AS day,
          coalesce(sum(p.amount_cents), 0)::bigint AS revenue_cents
        FROM payments p
        WHERE p.status = 'paid' AND p.paid_at >= current_date - interval '29 days'
        GROUP BY 1
      )
      SELECT d.day, coalesce(r.registrations, 0)::int AS registrations,
        coalesce(r.participants, 0)::int AS participants,
        coalesce(v.revenue_cents, 0)::bigint AS revenue_cents
      FROM days d
      LEFT JOIN registrations_by_day r USING (day)
      LEFT JOIN revenue_by_day v USING (day)
      ORDER BY d.day
    `,
    db`SELECT status AS key, count(*)::int AS value FROM registrations GROUP BY status ORDER BY value DESC`,
    db`
      SELECT r.route AS key, count(p.id)::int AS value
      FROM registrations r JOIN participants p ON p.registration_id = r.id
      WHERE r.status = 'confirmed' GROUP BY r.route ORDER BY value DESC
    `,
    db`
      SELECT r.life_state AS key, count(*)::int AS value
      FROM registrations r WHERE r.status = 'confirmed'
      GROUP BY r.life_state ORDER BY value DESC
    `,
    db`
      SELECT r.registration_type AS key, count(*)::int AS value
      FROM registrations r WHERE r.status = 'confirmed'
      GROUP BY r.registration_type ORDER BY value DESC
    `,
    db`
      SELECT CASE
        WHEN p.age_at_registration < 13 THEN '0–12'
        WHEN p.age_at_registration < 18 THEN '13–17'
        WHEN p.age_at_registration < 30 THEN '18–29'
        WHEN p.age_at_registration < 45 THEN '30–44'
        WHEN p.age_at_registration < 60 THEN '45–59'
        ELSE '60+'
      END AS key, count(*)::int AS value
      FROM participants p JOIN registrations r ON r.id = p.registration_id
      WHERE r.status = 'confirmed'
      GROUP BY 1 ORDER BY min(p.age_at_registration)
    `,
    db`
      SELECT p.nationality_code AS key, count(*)::int AS value
      FROM participants p JOIN registrations r ON r.id = p.registration_id
      WHERE r.status = 'confirmed'
      GROUP BY p.nationality_code ORDER BY value DESC, key LIMIT 10
    `,
    db`
      SELECT r.locale AS key, count(*)::int AS value
      FROM registrations r WHERE r.status = 'confirmed'
      GROUP BY r.locale ORDER BY value DESC
    `,
    db`
      SELECT rs.service_code AS key, count(*)::int AS value,
        coalesce(sum(rs.unit_amount_cents), 0)::bigint AS revenue_cents
      FROM registration_services rs
      JOIN registrations r ON r.id = rs.registration_id
      WHERE r.status = 'confirmed' AND rs.status IN ('requested', 'confirmed')
      GROUP BY rs.service_code ORDER BY value DESC
    `,
    db`
      SELECT
        coalesce(sum(r.base_amount_cents), 0)::bigint AS base_cents,
        coalesce(sum(r.extras_amount_cents), 0)::bigint AS extras_cents,
        coalesce(sum(r.donation_amount_cents), 0)::bigint AS donations_cents,
        coalesce(sum(r.family_discount_cents), 0)::bigint AS family_discount_cents,
        coalesce(sum(r.promo_discount_cents), 0)::bigint AS promo_discount_cents,
        coalesce(sum(r.total_amount_cents), 0)::bigint AS total_paid_cents,
        count(*) FILTER (WHERE r.discount_code_id IS NOT NULL)::int AS discount_registrations,
        count(*) FILTER (WHERE r.total_amount_cents = 0)::int AS free_registrations,
        coalesce((SELECT sum(total_amount_cents) FROM registrations WHERE status = 'pending_payment'), 0)::bigint AS pending_cents
      FROM registrations r WHERE r.status = 'confirmed'
    `,
    db`
      SELECT r.id, r.public_code, r.status, r.contact_email, r.contact_phone,
        r.life_state, r.registration_type, r.route, r.total_amount_cents,
        r.donation_amount_cents, r.locale, r.image_authorized, r.created_at,
        r.confirmed_at, concat_ws(' ', primary_person.first_name, primary_person.last_name) AS primary_name,
        coalesce(pax.participant_count, 0)::int AS participant_count,
        pax.nationalities, pax.service_codes,
        payment.status AS payment_status, payment.method AS payment_method,
        discount.code AS discount_code
      FROM registrations r
      LEFT JOIN LATERAL (
        SELECT first_name, last_name FROM participants
        WHERE registration_id = r.id AND role = 'primary' LIMIT 1
      ) primary_person ON true
      LEFT JOIN LATERAL (
        SELECT count(DISTINCT p.id)::int AS participant_count,
          string_agg(DISTINCT p.nationality_code, ',' ORDER BY p.nationality_code) AS nationalities,
          string_agg(DISTINCT rs.service_code, ',' ORDER BY rs.service_code) AS service_codes
        FROM participants p
        LEFT JOIN registration_services rs ON rs.participant_id = p.id
        WHERE p.registration_id = r.id
      ) pax ON true
      LEFT JOIN LATERAL (
        SELECT status, method FROM payments WHERE registration_id = r.id
        ORDER BY created_at DESC LIMIT 1
      ) payment ON true
      LEFT JOIN discount_codes discount ON discount.id = r.discount_code_id
      ORDER BY r.created_at DESC
      LIMIT 5000
    `,
  ]);

  const overviewRow = overviewRows[0] ?? {};
  const financeRow = financeRows[0] ?? {};
  const confirmed = number(overviewRow.confirmed_registrations);
  const total = number(overviewRow.total_registrations);
  const paidRevenueCents = number(financeRow.total_paid_cents);

  const finance: FinanceMetrics = {
    baseCents: number(financeRow.base_cents),
    extrasCents: number(financeRow.extras_cents),
    donationsCents: number(financeRow.donations_cents),
    familyDiscountCents: number(financeRow.family_discount_cents),
    promoDiscountCents: number(financeRow.promo_discount_cents),
    totalPaidCents: paidRevenueCents,
    pendingCents: number(financeRow.pending_cents),
    discountRegistrations: number(financeRow.discount_registrations),
    freeRegistrations: number(financeRow.free_registrations),
  };

  return {
    generatedAt: new Date().toISOString(),
    overview: {
      totalRegistrations: total,
      confirmedRegistrations: confirmed,
      pendingRegistrations: number(overviewRow.pending_registrations),
      cancelledRegistrations: number(overviewRow.cancelled_registrations),
      expiredRegistrations: number(overviewRow.expired_registrations),
      totalParticipants: number(overviewRow.total_participants),
      confirmedParticipants: number(overviewRow.confirmed_participants),
      paidRevenueCents,
      pendingRevenueCents: finance.pendingCents,
      donationCents: finance.donationsCents,
      averageOrderCents: confirmed ? Math.round(paidRevenueCents / confirmed) : 0,
      confirmationRate: total ? (confirmed / total) * 100 : 0,
      currentWeekRegistrations: number(overviewRow.current_week_registrations),
      previousWeekRegistrations: number(overviewRow.previous_week_registrations),
      currentWeekParticipants: number(overviewRow.current_week_participants),
      previousWeekParticipants: number(overviewRow.previous_week_participants),
      imageAuthorizationRate: confirmed
        ? (number(overviewRow.image_authorized_confirmed) / confirmed) * 100
        : 0,
    },
    trend: trendRows.map((row) => {
      const date = iso(row.day).slice(0, 10);
      return {
        date,
        label: new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short" }).format(new Date(`${date}T12:00:00Z`)),
        registrations: number(row.registrations),
        participants: number(row.participants),
        revenueCents: number(row.revenue_cents),
      };
    }),
    statuses: rowsToBreakdown(statusRows, statusLabels),
    routes: rowsToBreakdown(routeRows, routeLabels),
    lifeStates: rowsToBreakdown(lifeStateRows, lifeStateLabels),
    registrationTypes: rowsToBreakdown(registrationTypeRows, registrationTypeLabels),
    ageBands: rowsToBreakdown(ageRows),
    countries: rowsToBreakdown(countryRows),
    locales: rowsToBreakdown(localeRows, localeLabels),
    services: serviceRows.map((row): ServiceMetric => ({
      key: String(row.key),
      label: serviceLabels[String(row.key)] ?? String(row.key),
      value: number(row.value),
      revenueCents: number(row.revenue_cents),
    })),
    finance,
    registrations: registrationRows.map(mapRegistration),
  };
}

export async function getRegistrationDetail(id: string): Promise<RegistrationDetail | null> {
  noStore();
  const db = getDb();
  const rows = await db`
    SELECT r.*, concat_ws(' ', primary_person.first_name, primary_person.last_name) AS primary_name,
      coalesce(pax.participant_count, 0)::int AS participant_count,
      pax.nationalities, pax.service_codes,
      payment.provider AS payment_provider, payment.method AS payment_method,
      payment.status AS payment_status, payment.provider_transaction_id,
      payment.amount_cents AS payment_amount_cents, payment.paid_at,
      payment.expires_at, discount.code AS discount_code
    FROM registrations r
    LEFT JOIN LATERAL (
      SELECT first_name, last_name FROM participants
      WHERE registration_id = r.id AND role = 'primary' LIMIT 1
    ) primary_person ON true
    LEFT JOIN LATERAL (
      SELECT count(DISTINCT p.id)::int AS participant_count,
        string_agg(DISTINCT p.nationality_code, ',' ORDER BY p.nationality_code) AS nationalities,
        string_agg(DISTINCT rs.service_code, ',' ORDER BY rs.service_code) AS service_codes
      FROM participants p LEFT JOIN registration_services rs ON rs.participant_id = p.id
      WHERE p.registration_id = r.id
    ) pax ON true
    LEFT JOIN LATERAL (
      SELECT * FROM payments WHERE registration_id = r.id ORDER BY created_at DESC LIMIT 1
    ) payment ON true
    LEFT JOIN discount_codes discount ON discount.id = r.discount_code_id
    WHERE r.id = ${id}
    LIMIT 1
  `;

  const row = rows[0];
  if (!row) return null;

  const participantRows = await db`
    SELECT p.id, p.role, p.first_name, p.last_name, p.birth_date,
      p.age_at_registration, p.nationality_code, p.individual_price_cents,
      coalesce(
        json_agg(json_build_object('code', rs.service_code, 'status', rs.status, 'amountCents', rs.unit_amount_cents)
          ORDER BY rs.service_code) FILTER (WHERE rs.id IS NOT NULL),
        '[]'::json
      ) AS services
    FROM participants p
    LEFT JOIN registration_services rs ON rs.participant_id = p.id
    WHERE p.registration_id = ${id}
    GROUP BY p.id
    ORDER BY CASE WHEN p.role = 'primary' THEN 0 ELSE 1 END, p.created_at
  `;

  const summary = mapRegistration(row);
  const participants: ParticipantDetail[] = participantRows.map((participant) => ({
    id: String(participant.id),
    role: String(participant.role),
    firstName: String(participant.first_name),
    lastName: String(participant.last_name),
    birthDate: iso(participant.birth_date).slice(0, 10),
    age: number(participant.age_at_registration),
    nationality: String(participant.nationality_code),
    individualPriceCents: number(participant.individual_price_cents),
    services: (participant.services as { code: string; status: string; amountCents: number }[]).map((service) => ({
      code: service.code,
      status: service.status,
      amountCents: number(service.amountCents),
    })),
  }));

  return {
    ...summary,
    affiliationName: row.affiliation_name ? String(row.affiliation_name) : null,
    familyCapType: row.family_cap_type ? String(row.family_cap_type) : null,
    subtotalCents: number(row.subtotal_amount_cents),
    familyDiscountCents: number(row.family_discount_cents),
    baseCents: number(row.base_amount_cents),
    promoDiscountCents: number(row.promo_discount_cents),
    extrasCents: number(row.extras_amount_cents),
    termsAcceptedAt: iso(row.terms_accepted_at),
    privacyAcceptedAt: iso(row.privacy_accepted_at),
    payment: row.payment_status ? {
      provider: String(row.payment_provider),
      method: String(row.payment_method),
      status: row.payment_status as PaymentStatus,
      transactionId: row.provider_transaction_id ? String(row.provider_transaction_id) : null,
      amountCents: number(row.payment_amount_cents),
      paidAt: nullableIso(row.paid_at),
      expiresAt: nullableIso(row.expires_at),
    } : null,
    participants,
  };
}

export async function getRegistrationExportRows() {
  noStore();
  const db = getDb();
  return db`
    SELECT r.public_code, r.status, r.created_at, r.confirmed_at,
      r.contact_email, r.contact_phone, r.life_state, r.registration_type,
      r.route, r.affiliation_name, r.locale, r.image_authorized,
      r.subtotal_amount_cents, r.family_discount_cents, r.promo_discount_cents,
      r.base_amount_cents, r.extras_amount_cents, r.donation_amount_cents,
      r.total_amount_cents, discount.code AS discount_code,
      payment.method AS payment_method, payment.status AS payment_status,
      payment.provider_transaction_id, payment.paid_at,
      pax.participants, services.services
    FROM registrations r
    LEFT JOIN discount_codes discount ON discount.id = r.discount_code_id
    LEFT JOIN LATERAL (
      SELECT * FROM payments WHERE registration_id = r.id ORDER BY created_at DESC LIMIT 1
    ) payment ON true
    LEFT JOIN LATERAL (
      SELECT string_agg(
        concat_ws(' ', p.first_name, p.last_name) || ' (' || p.nationality_code || ', ' || p.age_at_registration || ' anos)',
        ' | ' ORDER BY CASE WHEN p.role = 'primary' THEN 0 ELSE 1 END, p.created_at
      ) AS participants
      FROM participants p WHERE p.registration_id = r.id
    ) pax ON true
    LEFT JOIN LATERAL (
      SELECT string_agg(DISTINCT rs.service_code, ' | ' ORDER BY rs.service_code) AS services
      FROM registration_services rs WHERE rs.registration_id = r.id
    ) services ON true
    ORDER BY r.created_at DESC
  `;
}
