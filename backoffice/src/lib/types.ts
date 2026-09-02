export type RegistrationStatus = "pending_payment" | "confirmed" | "cancelled" | "expired";
export type PaymentStatus = "created" | "pending" | "paid" | "failed" | "expired" | "refunded";

export interface OverviewMetrics {
  totalRegistrations: number;
  confirmedRegistrations: number;
  pendingRegistrations: number;
  cancelledRegistrations: number;
  expiredRegistrations: number;
  totalParticipants: number;
  confirmedParticipants: number;
  paidRevenueCents: number;
  pendingRevenueCents: number;
  donationCents: number;
  averageOrderCents: number;
  confirmationRate: number;
  currentWeekRegistrations: number;
  previousWeekRegistrations: number;
  currentWeekParticipants: number;
  previousWeekParticipants: number;
  imageAuthorizationRate: number;
}

export interface TrendPoint {
  date: string;
  label: string;
  registrations: number;
  participants: number;
  revenueCents: number;
}

export interface BreakdownItem {
  key: string;
  label: string;
  value: number;
}

export interface ServiceMetric extends BreakdownItem {
  revenueCents: number;
}

export interface FinanceMetrics {
  baseCents: number;
  extrasCents: number;
  donationsCents: number;
  familyDiscountCents: number;
  promoDiscountCents: number;
  totalPaidCents: number;
  pendingCents: number;
  discountRegistrations: number;
  freeRegistrations: number;
}

export interface RegistrationSummary {
  id: string;
  publicCode: string;
  status: RegistrationStatus;
  primaryName: string;
  contactEmail: string;
  contactPhone: string;
  lifeState: string;
  registrationType: string;
  route: string;
  participantCount: number;
  nationalities: string[];
  serviceCodes: string[];
  totalCents: number;
  donationCents: number;
  paymentStatus: PaymentStatus | null;
  paymentMethod: string | null;
  discountCode: string | null;
  locale: string;
  imageAuthorized: boolean;
  createdAt: string;
  confirmedAt: string | null;
}

export interface DashboardData {
  generatedAt: string;
  overview: OverviewMetrics;
  trend: TrendPoint[];
  statuses: BreakdownItem[];
  routes: BreakdownItem[];
  lifeStates: BreakdownItem[];
  registrationTypes: BreakdownItem[];
  ageBands: BreakdownItem[];
  countries: BreakdownItem[];
  locales: BreakdownItem[];
  services: ServiceMetric[];
  finance: FinanceMetrics;
  registrations: RegistrationSummary[];
}

export interface ParticipantDetail {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  age: number;
  nationality: string;
  individualPriceCents: number;
  services: { code: string; status: string; amountCents: number }[];
}

export interface RegistrationDetail extends RegistrationSummary {
  affiliationName: string | null;
  familyCapType: string | null;
  subtotalCents: number;
  familyDiscountCents: number;
  baseCents: number;
  promoDiscountCents: number;
  extrasCents: number;
  termsAcceptedAt: string;
  privacyAcceptedAt: string;
  payment: {
    provider: string;
    method: string;
    status: PaymentStatus;
    transactionId: string | null;
    amountCents: number;
    paidAt: string | null;
    expiresAt: string | null;
  } | null;
  participants: ParticipantDetail[];
}
