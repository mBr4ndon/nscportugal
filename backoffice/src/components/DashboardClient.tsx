"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Download,
  Eye,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPinned,
  Menu,
  Phone,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  TicketCheck,
  TrainFront,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  BreakdownItem,
  DashboardData,
  RegistrationDetail,
  RegistrationStatus,
  RegistrationSummary,
} from "@/lib/types";

const numberFormatter = new Intl.NumberFormat("pt-PT");
const currencyFormatter = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });
const dateFormatter = new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
const dateTimeFormatter = new Intl.DateTimeFormat("pt-PT", {
  day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
});
const countryNames = new Intl.DisplayNames(["pt"], { type: "region" });

const registrationStatusLabels: Record<string, string> = {
  confirmed: "Confirmada",
  pending_payment: "A aguardar",
  cancelled: "Cancelada",
  expired: "Expirada",
};

const paymentStatusLabels: Record<string, string> = {
  created: "Criado",
  pending: "Pendente",
  paid: "Pago",
  failed: "Falhou",
  expired: "Expirado",
  refunded: "Reembolsado",
};

const serviceLabels: Record<string, string> = {
  dormida_nazare: "Dormida em Nazaré",
  dormida_fatima: "Dormida em Fátima",
  transporte_nazare: "Transporte de Nazaré",
};

const lifeStateLabels: Record<string, string> = {
  leigo: "Leigo",
  sacerdote: "Sacerdote",
  religioso: "Religioso",
};

const routeLabels: Record<string, string> = {
  adultos: "Adultos",
  familias: "Famílias",
};

function formatCurrency(cents: number) {
  return currencyFormatter.format(cents / 100);
}

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "—";
}

function formatDateTime(value: string | null) {
  return value ? dateTimeFormatter.format(new Date(value)) : "—";
}

function countryLabel(code: string) {
  try {
    return countryNames.of(code) ?? code;
  } catch {
    return code;
  }
}

function relativeChange(current: number, previous: number) {
  if (!previous) return current ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function Delta({ current, previous, suffix = "vs. 7 dias anteriores" }: { current: number; previous: number; suffix?: string }) {
  const delta = relativeChange(current, previous);
  const positive = delta >= 0;
  return (
    <span className={`metric-delta ${positive ? "positive" : "negative"}`}>
      {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {Math.abs(delta).toFixed(0)}% <em>{suffix}</em>
    </span>
  );
}

function StatusBadge({ status }: { status: RegistrationStatus }) {
  return <span className={`status-badge status-${status}`}><i />{registrationStatusLabels[status] ?? status}</span>;
}

function ProgressList({ items, country = false }: { items: BreakdownItem[]; country?: boolean }) {
  const maximum = Math.max(...items.map((item) => item.value), 1);
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="progress-list">
      {items.map((item) => (
        <div className="progress-item" key={item.key}>
          <div className="progress-copy">
            <span>{country ? countryLabel(item.label) : item.label}</span>
            <b>{numberFormatter.format(item.value)} <small>· {total ? Math.round(item.value / total * 100) : 0}%</small></b>
          </div>
          <div className="progress-track"><span style={{ width: `${item.value / maximum * 100}%` }} /></div>
        </div>
      ))}
      {!items.length && <p className="empty-copy">Ainda não existem dados confirmados.</p>}
    </div>
  );
}

function DonutChart({ items }: { items: BreakdownItem[] }) {
  const colors: Record<string, string> = {
    confirmed: "#2C3E50",
    pending_payment: "#B08D57",
    cancelled: "#B26758",
    expired: "#8B9BAE",
  };
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let cursor = 0;
  const stops = items.map((item) => {
    const start = cursor;
    cursor += total ? item.value / total * 360 : 0;
    return `${colors[item.key] ?? "#5A6E84"} ${start}deg ${cursor}deg`;
  });
  const style = { background: total ? `conic-gradient(${stops.join(",")})` : "#ece9e2" };

  return (
    <div className="donut-layout">
      <div className="donut" style={style} role="img" aria-label={`Distribuição de ${total} inscrições`}>
        <div><strong>{numberFormatter.format(total)}</strong><span>inscrições</span></div>
      </div>
      <div className="donut-legend">
        {items.map((item) => (
          <div key={item.key}>
            <i style={{ backgroundColor: colors[item.key] ?? "#5A6E84" }} />
            <span>{item.label}</span>
            <b>{item.value}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailLine({ label, value, strong = false }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return <div className={`detail-line ${strong ? "strong" : ""}`}><span>{label}</span><b>{value}</b></div>;
}

function RegistrationDrawer({
  registration,
  loading,
  error,
  onClose,
}: {
  registration: RegistrationDetail | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("drawer-open");
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("drawer-open");
    };
  }, [onClose]);

  return (
    <div className="drawer-layer" role="dialog" aria-modal="true" aria-label="Detalhes da inscrição">
      <button className="drawer-backdrop" onClick={onClose} aria-label="Fechar detalhes" />
      <aside className="detail-drawer">
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Ficha de inscrição</p>
            <h2>{registration?.publicCode ?? "A carregar…"}</h2>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Fechar"><X size={20} /></button>
        </div>
        {loading && <div className="drawer-loading"><RefreshCw className="spin" /><span>A reunir todos os dados…</span></div>}
        {!loading && error && <div className="drawer-loading drawer-error"><X /><strong>{error}</strong><span>Feche esta ficha e tente novamente.</span></div>}
        {!loading && registration && (
          <div className="drawer-content">
            <div className="drawer-summary">
              <StatusBadge status={registration.status} />
              <span>Registada {formatDateTime(registration.createdAt)}</span>
            </div>

            <section className="drawer-section">
              <h3><UserRound size={17} /> Contacto principal</h3>
              <p className="contact-name">{registration.primaryName}</p>
              <div className="contact-links">
                <a href={`mailto:${registration.contactEmail}`}><Mail size={16} />{registration.contactEmail}</a>
                <a href={`tel:${registration.contactPhone}`}><Phone size={16} />{registration.contactPhone}</a>
              </div>
              {registration.affiliationName && <p className="muted-line">Afiliação: {registration.affiliationName}</p>}
            </section>

            <section className="drawer-section">
              <h3><UsersRound size={17} /> Participantes <span>{registration.participants.length}</span></h3>
              <div className="participant-list">
                {registration.participants.map((participant) => (
                  <article className="participant-card" key={participant.id}>
                    <div className="participant-avatar">{participant.firstName[0]}{participant.lastName[0]}</div>
                    <div className="participant-copy">
                      <strong>{participant.firstName} {participant.lastName}</strong>
                      <span>{participant.role === "primary" ? "Responsável" : "Membro da família"} · {participant.age} anos · {countryLabel(participant.nationality)}</span>
                      {!!participant.services.length && (
                        <div className="service-pills">
                          {participant.services.map((service) => <i key={service.code}>{serviceLabels[service.code] ?? service.code}</i>)}
                        </div>
                      )}
                    </div>
                    <b>{formatCurrency(participant.individualPriceCents)}</b>
                  </article>
                ))}
              </div>
            </section>

            <section className="drawer-section">
              <h3><TicketCheck size={17} /> Inscrição</h3>
              <div className="detail-grid">
                <DetailLine label="Rota" value={routeLabels[registration.route] ?? registration.route} />
                <DetailLine label="Modalidade" value={registration.registrationType === "familia" ? "Família" : "Individual"} />
                <DetailLine label="Estado de vida" value={lifeStateLabels[registration.lifeState] ?? registration.lifeState} />
                <DetailLine label="Idioma" value={registration.locale.toUpperCase()} />
                <DetailLine label="Autoriza imagem" value={registration.imageAuthorized ? "Sim" : "Não"} />
                <DetailLine label="Código de desconto" value={registration.discountCode ?? "—"} />
              </div>
            </section>

            <section className="drawer-section finance-detail">
              <h3><CircleDollarSign size={17} /> Valores e pagamento</h3>
              <DetailLine label="Subtotal" value={formatCurrency(registration.subtotalCents)} />
              {registration.familyDiscountCents > 0 && <DetailLine label="Desconto família" value={`− ${formatCurrency(registration.familyDiscountCents)}`} />}
              {registration.promoDiscountCents > 0 && <DetailLine label="Desconto promocional" value={`− ${formatCurrency(registration.promoDiscountCents)}`} />}
              <DetailLine label="Base da inscrição" value={formatCurrency(registration.baseCents)} />
              <DetailLine label="Serviços adicionais" value={formatCurrency(registration.extrasCents)} />
              <DetailLine label="Donativo" value={formatCurrency(registration.donationCents)} />
              <DetailLine label="Total" value={formatCurrency(registration.totalCents)} strong />
              <div className="payment-strip">
                <span className={`payment-dot payment-${registration.payment?.status ?? "none"}`} />
                <div>
                  <strong>{registration.payment ? paymentStatusLabels[registration.payment.status] : "Sem pagamento"}</strong>
                  <span>{registration.payment?.method ? `${registration.payment.method.toUpperCase()} · ${formatDateTime(registration.payment.paidAt)}` : "Não existe registo de pagamento"}</span>
                </div>
              </div>
            </section>
          </div>
        )}
      </aside>
    </div>
  );
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [trendPeriod, setTrendPeriod] = useState<7 | 14 | 30>(30);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [routeFilter, setRouteFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<RegistrationDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const pageSize = 10;

  const filteredRegistrations = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt");
    const rows = data.registrations.filter((registration) => {
      const matchesSearch = !term || [
        registration.publicCode,
        registration.primaryName,
        registration.contactEmail,
        registration.contactPhone,
      ].some((value) => value.toLocaleLowerCase("pt").includes(term));
      return matchesSearch
        && (statusFilter === "all" || registration.status === statusFilter)
        && (routeFilter === "all" || registration.route === routeFilter)
        && (typeFilter === "all" || registration.registrationType === typeFilter);
    });

    return rows.sort((left, right) => {
      if (sort === "oldest") return left.createdAt.localeCompare(right.createdAt);
      if (sort === "amount_desc") return right.totalCents - left.totalCents;
      if (sort === "participants_desc") return right.participantCount - left.participantCount;
      return right.createdAt.localeCompare(left.createdAt);
    });
  }, [data.registrations, routeFilter, search, sort, statusFilter, typeFilter]);

  useEffect(() => setPage(1), [search, statusFilter, routeFilter, typeFilter, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredRegistrations.length / pageSize));
  const visibleRegistrations = filteredRegistrations.slice((page - 1) * pageSize, page * pageSize);
  const trend = data.trend.slice(-trendPeriod);
  const trendMax = Math.max(...trend.map((point) => point.participants), 1);
  const peakPoint = trend.reduce((peak, point) => point.participants > peak.participants ? point : peak, trend[0]);
  const largestRoute = data.routes[0];
  const leadingCountry = data.countries[0];
  const weeklyDelta = relativeChange(data.overview.currentWeekRegistrations, data.overview.previousWeekRegistrations);

  async function openDetail(registration: RegistrationSummary) {
    setSelectedId(registration.id);
    setDetail(null);
    setDetailError(null);
    setDetailLoading(true);
    try {
      const response = await fetch(`/api/registrations/${registration.id}`, { cache: "no-store" });
      if (!response.ok) throw new Error();
      setDetail(await response.json() as RegistrationDetail);
    } catch {
      setDetailError("Não foi possível carregar esta inscrição.");
    } finally {
      setDetailLoading(false);
    }
  }

  function navTo(id: string) {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="dashboard-shell">
      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark small">NSC</div>
          <div><strong>Peregrinação</strong><span>Backoffice · 2026</span></div>
        </div>
        <nav aria-label="Navegação principal">
          <button className="active" onClick={() => navTo("visao-geral")}><LayoutDashboard size={18} />Visão geral</button>
          <button onClick={() => navTo("inscricoes")}><TicketCheck size={18} />Inscrições <span>{data.overview.totalRegistrations}</span></button>
          <button onClick={() => navTo("participantes")}><UsersRound size={18} />Participantes</button>
          <button onClick={() => navTo("financeiro")}><CircleDollarSign size={18} />Financeiro</button>
          <button onClick={() => navTo("operacao")}><BedDouble size={18} />Operação</button>
        </nav>
        <div className="sidebar-event">
          <CalendarDays size={18} />
          <div><span>Início da peregrinação</span><strong>10 outubro 2026</strong></div>
        </div>
        <form action="/api/logout" method="post" className="logout-form">
          <button type="submit"><LogOut size={17} />Terminar sessão</button>
        </form>
      </aside>
      {mobileMenu && <button className="mobile-backdrop" onClick={() => setMobileMenu(false)} aria-label="Fechar menu" />}

      <main className="dashboard-main">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileMenu(true)} aria-label="Abrir menu"><Menu /></button>
          <div>
            <p className="eyebrow">Painel de acompanhamento</p>
            <h1>Bom dia, equipa</h1>
          </div>
          <div className="topbar-actions">
            <span className="last-update">Atualizado às {new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit" }).format(new Date(data.generatedAt))}</span>
            <button className="secondary-button" onClick={() => window.location.reload()}><RefreshCw size={17} /><span>Atualizar</span></button>
            <a className="primary-button" href="/api/export"><Download size={17} /><span>Exportar CSV</span></a>
          </div>
        </header>

        <div className="dashboard-content">
          <section id="visao-geral" className="section-block hero-section">
            <div className="section-heading">
              <div><p className="eyebrow">Visão geral</p><h2>O essencial, num relance</h2></div>
              <div className="live-indicator"><i /> Dados em tempo real</div>
            </div>

            <div className="metrics-grid">
              <article className="metric-card featured">
                <div className="metric-icon"><UsersRound size={21} /></div>
                <span>Participantes confirmados</span>
                <strong>{numberFormatter.format(data.overview.confirmedParticipants)}</strong>
                <Delta current={data.overview.currentWeekParticipants} previous={data.overview.previousWeekParticipants} />
              </article>
              <article className="metric-card">
                <div className="metric-icon petrol"><TicketCheck size={21} /></div>
                <span>Inscrições confirmadas</span>
                <strong>{numberFormatter.format(data.overview.confirmedRegistrations)}</strong>
                <Delta current={data.overview.currentWeekRegistrations} previous={data.overview.previousWeekRegistrations} />
              </article>
              <article className="metric-card">
                <div className="metric-icon gold"><CircleDollarSign size={21} /></div>
                <span>Receita confirmada</span>
                <strong>{formatCurrency(data.overview.paidRevenueCents)}</strong>
                <p>{formatCurrency(data.overview.pendingRevenueCents)} ainda pendentes</p>
              </article>
              <article className="metric-card">
                <div className="metric-icon rose"><HeartHandshake size={21} /></div>
                <span>Donativos recebidos</span>
                <strong>{formatCurrency(data.overview.donationCents)}</strong>
                <p>Ticket médio de {formatCurrency(data.overview.averageOrderCents)}</p>
              </article>
            </div>

            <div className="analytics-grid">
              <article className="panel trend-panel">
                <div className="panel-header">
                  <div><span className="panel-kicker">Ritmo de inscrições</span><h3>Novos participantes</h3></div>
                  <select value={trendPeriod} onChange={(event) => setTrendPeriod(Number(event.target.value) as 7 | 14 | 30)} aria-label="Período do gráfico">
                    <option value={7}>7 dias</option><option value={14}>14 dias</option><option value={30}>30 dias</option>
                  </select>
                </div>
                <div className="trend-summary">
                  <strong>{numberFormatter.format(trend.reduce((sum, point) => sum + point.participants, 0))}</strong>
                  <span>participantes no período</span>
                  <i className={weeklyDelta >= 0 ? "positive" : "negative"}>{weeklyDelta >= 0 ? "+" : ""}{weeklyDelta.toFixed(0)}%</i>
                </div>
                <div className="bar-chart" aria-label="Participantes por dia">
                  {trend.map((point, index) => (
                    <div className="bar-column" key={point.date} title={`${point.label}: ${point.participants} participantes`}>
                      <div className="bar-value">{point.participants || ""}</div>
                      <div className={`bar ${point.date === peakPoint?.date ? "peak" : ""}`} style={{ height: `${Math.max(point.participants / trendMax * 100, point.participants ? 8 : 2)}%` }} />
                      {(index === 0 || index === trend.length - 1 || index % Math.max(1, Math.round(trend.length / 5)) === 0) && <span>{point.label}</span>}
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel status-panel">
                <div className="panel-header"><div><span className="panel-kicker">Estado global</span><h3>Inscrições</h3></div><span className="conversion-rate">{data.overview.confirmationRate.toFixed(0)}% confirmadas</span></div>
                <DonutChart items={data.statuses} />
              </article>
            </div>

            <div className="insight-strip">
              <div className="insight-icon"><Sparkles size={18} /></div>
              <p><strong>Leitura rápida:</strong> {largestRoute ? `${largestRoute.label} concentra ${largestRoute.value} participantes confirmados` : "a distribuição por rota aparecerá quando existirem confirmações"}{leadingCountry ? ` e ${countryLabel(leadingCountry.key)} é a nacionalidade mais representada.` : "."}</p>
            </div>
          </section>

          <section id="participantes" className="section-block">
            <div className="section-heading compact">
              <div><p className="eyebrow">Quem vem connosco</p><h2>Perfil dos participantes</h2></div>
              <p>Distribuição calculada sobre participantes confirmados.</p>
            </div>
            <div className="profile-grid">
              <article className="panel"><div className="panel-header"><div><span className="panel-kicker">Percurso</span><h3>Participantes por rota</h3></div><MapPinned size={20} /></div><ProgressList items={data.routes} /></article>
              <article className="panel"><div className="panel-header"><div><span className="panel-kicker">Idades</span><h3>Faixas etárias</h3></div><UsersRound size={20} /></div><ProgressList items={data.ageBands} /></article>
              <article className="panel"><div className="panel-header"><div><span className="panel-kicker">Origem</span><h3>Nacionalidades</h3></div><span>{data.countries.length} países</span></div><ProgressList items={data.countries} country /></article>
            </div>
            <div className="compact-stats">
              <article><span>Tipo de inscrição</span><div>{data.registrationTypes.map((item) => <p key={item.key}><b>{item.value}</b>{item.label}</p>)}</div></article>
              <article><span>Estado de vida</span><div>{data.lifeStates.map((item) => <p key={item.key}><b>{item.value}</b>{item.label}</p>)}</div></article>
              <article><span>Idioma da inscrição</span><div>{data.locales.map((item) => <p key={item.key}><b>{item.value}</b>{item.label}</p>)}</div></article>
              <article><span>Autorização de imagem</span><strong>{data.overview.imageAuthorizationRate.toFixed(0)}%</strong><small>das inscrições confirmadas</small></article>
            </div>
          </section>

          <section id="financeiro" className="section-block finance-section">
            <div className="section-heading compact"><div><p className="eyebrow">Financeiro</p><h2>Receita, descontos e donativos</h2></div><p>Apenas valores de inscrições confirmadas.</p></div>
            <div className="finance-grid">
              <article className="finance-hero">
                <div className="finance-hero-top"><span>Total recebido</span><CircleDollarSign size={24} /></div>
                <strong>{formatCurrency(data.finance.totalPaidCents)}</strong>
                <p>{numberFormatter.format(data.overview.confirmedRegistrations)} inscrições · média de {formatCurrency(data.overview.averageOrderCents)}</p>
                <div className="finance-composition">
                  <div style={{ width: `${data.finance.totalPaidCents ? data.finance.baseCents / data.finance.totalPaidCents * 100 : 0}%` }} />
                  <div style={{ width: `${data.finance.totalPaidCents ? data.finance.extrasCents / data.finance.totalPaidCents * 100 : 0}%` }} />
                  <div style={{ width: `${data.finance.totalPaidCents ? data.finance.donationsCents / data.finance.totalPaidCents * 100 : 0}%` }} />
                </div>
                <div className="finance-legend"><span><i />Inscrições</span><span><i />Serviços</span><span><i />Donativos</span></div>
              </article>
              <article className="panel finance-lines">
                <DetailLine label="Valor base" value={formatCurrency(data.finance.baseCents)} />
                <DetailLine label="Serviços adicionais" value={formatCurrency(data.finance.extrasCents)} />
                <DetailLine label="Donativos" value={formatCurrency(data.finance.donationsCents)} />
                <DetailLine label="Descontos familiares" value={`− ${formatCurrency(data.finance.familyDiscountCents)}`} />
                <DetailLine label="Descontos promocionais" value={`− ${formatCurrency(data.finance.promoDiscountCents)}`} />
              </article>
              <div className="finance-mini-grid">
                <article><span>Por receber</span><strong>{formatCurrency(data.finance.pendingCents)}</strong><small>{data.overview.pendingRegistrations} inscrições pendentes</small></article>
                <article><span>Códigos usados</span><strong>{data.finance.discountRegistrations}</strong><small>inscrições com promoção</small></article>
                <article><span>Inscrições isentas</span><strong>{data.finance.freeRegistrations}</strong><small>total final de 0 €</small></article>
              </div>
            </div>
          </section>

          <section id="operacao" className="section-block">
            <div className="section-heading compact"><div><p className="eyebrow">Operação</p><h2>Serviços adicionais</h2></div><p>Pedidos associados a inscrições confirmadas.</p></div>
            <div className="services-grid">
              {data.services.map((service) => {
                const Icon = service.key === "transporte_nazare" ? TrainFront : BedDouble;
                return (
                  <article className="service-card" key={service.key}>
                    <div className="service-icon"><Icon size={23} /></div>
                    <div><span>{service.label}</span><strong>{numberFormatter.format(service.value)}</strong><small>pedidos · {formatCurrency(service.revenueCents)}</small></div>
                  </article>
                );
              })}
              {!data.services.length && <article className="service-card empty-copy">Ainda não existem serviços confirmados.</article>}
            </div>
          </section>

          <section id="inscricoes" className="section-block registrations-section">
            <div className="section-heading compact">
              <div><p className="eyebrow">Base completa</p><h2>Todas as inscrições</h2></div>
              <p>{filteredRegistrations.length} de {data.registrations.length} registos</p>
            </div>
            <div className="table-panel">
              <div className="table-tools">
                <div className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Procurar nome, email, telefone ou referência…" aria-label="Procurar inscrições" />{search && <button onClick={() => setSearch("")} aria-label="Limpar pesquisa"><X size={15} /></button>}</div>
                <div className="filter-group"><SlidersHorizontal size={16} />
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filtrar por estado"><option value="all">Todos os estados</option><option value="confirmed">Confirmadas</option><option value="pending_payment">A aguardar</option><option value="cancelled">Canceladas</option><option value="expired">Expiradas</option></select>
                  <select value={routeFilter} onChange={(event) => setRouteFilter(event.target.value)} aria-label="Filtrar por rota"><option value="all">Todas as rotas</option><option value="adultos">Adultos</option><option value="familias">Famílias</option></select>
                  <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} aria-label="Filtrar por tipo"><option value="all">Todos os tipos</option><option value="individual">Individual</option><option value="familia">Família</option></select>
                  <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar inscrições"><option value="recent">Mais recentes</option><option value="oldest">Mais antigas</option><option value="amount_desc">Maior valor</option><option value="participants_desc">Mais participantes</option></select>
                </div>
              </div>
              <div className="table-scroll">
                <table>
                  <thead><tr><th>Referência / titular</th><th>Estado</th><th>Rota</th><th>Participantes</th><th>Pagamento</th><th>Total</th><th>Data</th><th><span className="sr-only">Abrir</span></th></tr></thead>
                  <tbody>
                    {visibleRegistrations.map((registration) => (
                      <tr key={registration.id}>
                        <td><button className="registration-person" onClick={() => openDetail(registration)}><span className="table-avatar">{registration.primaryName.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span><span><strong>{registration.primaryName}</strong><small>{registration.publicCode} · {registration.contactEmail}</small></span></button></td>
                        <td><StatusBadge status={registration.status} /></td>
                        <td><span className="route-cell">{registration.route === "familias" ? <UsersRound size={15} /> : <MapPinned size={15} />}{routeLabels[registration.route] ?? registration.route}</span></td>
                        <td><strong className="participant-count">{registration.participantCount}</strong></td>
                        <td><span className={`payment-label payment-${registration.paymentStatus ?? "none"}`}><i />{registration.paymentStatus ? paymentStatusLabels[registration.paymentStatus] : "—"}</span></td>
                        <td><strong>{formatCurrency(registration.totalCents)}</strong>{registration.donationCents > 0 && <small className="donation-note">+ donativo</small>}</td>
                        <td><span className="date-cell">{formatDate(registration.createdAt)}</span></td>
                        <td><button className="view-button" onClick={() => openDetail(registration)} aria-label={`Ver ${registration.publicCode}`}><Eye size={17} /></button></td>
                      </tr>
                    ))}
                    {!visibleRegistrations.length && <tr><td colSpan={8}><div className="table-empty"><Search size={24} /><strong>Sem resultados</strong><span>Experimente alterar a pesquisa ou os filtros.</span></div></td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="table-footer">
                <span>A mostrar {filteredRegistrations.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredRegistrations.length)} de {filteredRegistrations.length}</span>
                <div><button disabled={page === 1} onClick={() => setPage((value) => value - 1)} aria-label="Página anterior"><ChevronLeft size={17} /></button><span>Página {page} de {pageCount}</span><button disabled={page === pageCount} onClick={() => setPage((value) => value + 1)} aria-label="Página seguinte"><ChevronRight size={17} /></button></div>
              </div>
            </div>
          </section>
        </div>
        <footer className="dashboard-footer"><span>Peregrinação Nossa Senhora da Cristandade · 2026</span><span><Check size={14} /> Ligação segura</span></footer>
      </main>

      {selectedId && <RegistrationDrawer registration={detail} loading={detailLoading} error={detailError} onClose={() => { setSelectedId(null); setDetail(null); setDetailError(null); }} />}
    </div>
  );
}
