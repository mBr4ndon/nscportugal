import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import QRCode from "qrcode";
import type { DadosBilhete, ParticipanteBilhete } from "@/lib/storage";

const translations = {
  pt: {
    title: "Bilhete de Peregrino", subtitle: "Peregrinação de Nossa Senhora da Cristandade",
    dates: "10 a 12 de outubro de 2026", reference: "Referência", confirmed: "Confirmado",
    route: "Percurso", adults: "Adultos - cerca de 25 km por dia", families: "Famílias - cerca de 10 km por dia",
    contact: "Contacto", phone: "Telemóvel", life: "Estado de vida", lay: "Leigo", priest: "Sacerdote",
    religious: "Religioso / Religiosa", affiliation: "Instituição", participants: "Participantes",
    lead: "Responsável", member: "Membro", birth: "Nascimento", nationality: "Nacionalidade",
    services: "Serviços solicitados", none: "Nenhum", nazare: "Dormida na Nazaré - 9 de outubro",
    fatima: "Dormida em Fátima - 12 de outubro", transport: "Transporte Fátima-Nazaré - 12 de outubro",
    total: "Total pago", free: "Isento", qr: "Código único do bilhete",
    note: "Apresente este bilhete no acolhimento. A disponibilidade dos serviços será confirmada pela organização.",
  },
  en: {
    title: "Pilgrim Ticket", subtitle: "Pilgrimage of Our Lady of Christendom",
    dates: "10 to 12 October 2026", reference: "Reference", confirmed: "Confirmed",
    route: "Route", adults: "Adults - approximately 25 km per day", families: "Families - approximately 10 km per day",
    contact: "Contact", phone: "Mobile phone", life: "State of life", lay: "Lay person", priest: "Priest",
    religious: "Religious", affiliation: "Institution", participants: "Participants",
    lead: "Lead participant", member: "Member", birth: "Date of birth", nationality: "Nationality",
    services: "Requested services", none: "None", nazare: "Accommodation in Nazaré - 9 October",
    fatima: "Accommodation in Fátima - 12 October", transport: "Transport Fátima-Nazaré - 12 October",
    total: "Total paid", free: "Exempt", qr: "Unique ticket code",
    note: "Present this ticket at reception. Service availability will be confirmed by the organisers.",
  },
  es: {
    title: "Billete de Peregrino", subtitle: "Peregrinación de Nuestra Señora de la Cristiandad",
    dates: "10 al 12 de octubre de 2026", reference: "Referencia", confirmed: "Confirmado",
    route: "Recorrido", adults: "Adultos - aproximadamente 25 km al día", families: "Familias - aproximadamente 10 km al día",
    contact: "Contacto", phone: "Teléfono móvil", life: "Estado de vida", lay: "Laico", priest: "Sacerdote",
    religious: "Religioso / Religiosa", affiliation: "Institución", participants: "Participantes",
    lead: "Responsable", member: "Miembro", birth: "Nacimiento", nationality: "Nacionalidad",
    services: "Servicios solicitados", none: "Ninguno", nazare: "Alojamiento en Nazaré - 9 de octubre",
    fatima: "Alojamiento en Fátima - 12 de octubre", transport: "Transporte Fátima-Nazaré - 12 de octubre",
    total: "Total pagado", free: "Exento", qr: "Código único del billete",
    note: "Presente este billete en la recepción. La organización confirmará la disponibilidad de los servicios.",
  },
  fr: {
    title: "Billet de Pèlerin", subtitle: "Pèlerinage de Notre-Dame de la Chrétienté",
    dates: "Du 10 au 12 octobre 2026", reference: "Référence", confirmed: "Confirmé",
    route: "Parcours", adults: "Adultes - environ 25 km par jour", families: "Familles - environ 10 km par jour",
    contact: "Contact", phone: "Téléphone", life: "État de vie", lay: "Laïc", priest: "Prêtre",
    religious: "Religieux / Religieuse", affiliation: "Institution", participants: "Participants",
    lead: "Responsable", member: "Membre", birth: "Naissance", nationality: "Nationalité",
    services: "Services demandés", none: "Aucun", nazare: "Hébergement à Nazaré - 9 octobre",
    fatima: "Hébergement à Fátima - 12 octobre", transport: "Transport Fátima-Nazaré - 12 octobre",
    total: "Total payé", free: "Exonéré", qr: "Code unique du billet",
    note: "Présentez ce billet à l'accueil. La disponibilité des services sera confirmée par l'organisation.",
  },
  it: {
    title: "Biglietto del Pellegrino", subtitle: "Pellegrinaggio di Nostra Signora della Cristianità",
    dates: "Dal 10 al 12 ottobre 2026", reference: "Riferimento", confirmed: "Confermato",
    route: "Percorso", adults: "Adulti - circa 25 km al giorno", families: "Famiglie - circa 10 km al giorno",
    contact: "Contatto", phone: "Cellulare", life: "Stato di vita", lay: "Laico", priest: "Sacerdote",
    religious: "Religioso / Religiosa", affiliation: "Istituzione", participants: "Partecipanti",
    lead: "Responsabile", member: "Membro", birth: "Data di nascita", nationality: "Nazionalità",
    services: "Servizi richiesti", none: "Nessuno", nazare: "Alloggio a Nazaré - 9 ottobre",
    fatima: "Alloggio a Fátima - 12 ottobre", transport: "Trasporto Fátima-Nazaré - 12 ottobre",
    total: "Totale pagato", free: "Esente", qr: "Codice univoco del biglietto",
    note: "Presenti questo biglietto all'accoglienza. La disponibilità dei servizi sarà confermata dall'organizzazione.",
  },
} as const;

type TicketLocale = keyof typeof translations;
const petrol = rgb(30 / 255, 57 / 255, 66 / 255);
const gold = rgb(184 / 255, 145 / 255, 73 / 255);
const cream = rgb(249 / 255, 246 / 255, 238 / 255);

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/)) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) current = candidate;
    else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function formatDateOnly(value: string, locale: TicketLocale): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;
  const [, year, month, day] = match;
  return new Intl.DateTimeFormat(locale, { timeZone: "UTC" }).format(
    new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))),
  );
}

export async function gerarBilhetePdf(data: DadosBilhete): Promise<Uint8Array> {
  const locale = (data.locale in translations ? data.locale : "pt") as TicketLocale;
  const t = translations[locale];
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const qrDataUrl = await QRCode.toDataURL(`PNSC:TICKET:${data.token}`, { width: 420, margin: 1 });
  const qr = await pdf.embedPng(qrDataUrl);
  const pageSize: [number, number] = [595.28, 841.89];
  let page!: PDFPage;
  let y = 0;

  const newPage = () => {
    page = pdf.addPage(pageSize);
    page.drawRectangle({ x: 0, y: 0, width: pageSize[0], height: pageSize[1], color: cream });
    page.drawRectangle({ x: 0, y: pageSize[1] - 13, width: pageSize[0], height: 13, color: gold });
    y = 780;
  };
  const ensure = (height: number) => { if (y - height < 55) newPage(); };
  const line = (label: string, value: string) => {
    ensure(22);
    page.drawText(`${label}:`, { x: 48, y, size: 9, font: bold, color: gold });
    page.drawText(value, { x: 160, y, size: 9, font: regular, color: petrol });
    y -= 18;
  };
  const section = (title: string) => {
    ensure(35);
    y -= 8;
    page.drawText(title.toUpperCase(), { x: 48, y, size: 10, font: bold, color: gold });
    page.drawLine({ start: { x: 48, y: y - 7 }, end: { x: 547, y: y - 7 }, thickness: 0.6, color: gold });
    y -= 27;
  };

  newPage();
  page.drawText(t.subtitle.toUpperCase(), { x: 48, y, size: 9, font: bold, color: gold });
  y -= 36;
  page.drawText(t.title, { x: 48, y, size: 28, font: bold, color: petrol });
  y -= 26;
  page.drawText(t.dates, { x: 48, y, size: 11, font: regular, color: petrol });
  y -= 35;
  line(t.reference, data.referencia);
  line(t.confirmed, new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(data.confirmadoEm)));
  line(t.route, data.rota === "adultos" ? t.adults : t.families);
  line(t.life, data.estadoVida === "sacerdote" ? t.priest : data.estadoVida === "religioso" ? t.religious : t.lay);
  if (data.afiliacao) line(t.affiliation, data.afiliacao);
  line(t.contact, data.email);
  line(t.phone, data.telefone);
  line(t.total, data.totalCentimos === 0 ? t.free : new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(data.totalCentimos / 100));

  section(t.participants);
  const displayNames = new Intl.DisplayNames([locale], { type: "region" });
  const serviceLabels: Record<string, string> = {
    dormida_nazare: t.nazare, dormida_fatima: t.fatima, transporte_nazare: t.transport,
  };
  const drawParticipant = (participant: ParticipanteBilhete, index: number) => {
    const services = participant.servicos.map((service) => serviceLabels[service] ?? service);
    const blockHeight = 61 + Math.max(1, services.length) * 14;
    ensure(blockHeight);
    page.drawRectangle({ x: 48, y: y - blockHeight + 13, width: 499, height: blockHeight, color: rgb(1, 1, 1), opacity: 0.65 });
    page.drawText(`${index + 1}. ${participant.nome} ${participant.apelido}`, { x: 60, y, size: 11, font: bold, color: petrol });
    page.drawText(participant.principal ? t.lead : t.member, { x: 430, y, size: 8, font: bold, color: gold });
    y -= 18;
    const birth = formatDateOnly(participant.dataNascimento, locale);
    page.drawText(`${t.birth}: ${birth}   |   ${t.nationality}: ${displayNames.of(participant.nacionalidade) ?? participant.nacionalidade}`, { x: 60, y, size: 8.5, font: regular, color: petrol });
    y -= 18;
    page.drawText(`${t.services}:`, { x: 60, y, size: 8.5, font: bold, color: gold });
    y -= 14;
    for (const service of services.length ? services : [t.none]) {
      page.drawText(`- ${service}`, { x: 70, y, size: 8.5, font: regular, color: petrol });
      y -= 14;
    }
    y -= 15;
  };
  data.participantes.forEach(drawParticipant);

  ensure(170);
  section(t.qr);
  page.drawImage(qr, { x: 48, y: y - 118, width: 118, height: 118 });
  const noteLines = wrap(t.note, regular, 9, 350);
  noteLines.forEach((text, index) => page.drawText(text, { x: 188, y: y - 15 - index * 14, size: 9, font: regular, color: petrol }));
  page.drawText(data.referencia, { x: 188, y: y - 85, size: 12, font: bold, color: gold });

  pdf.setTitle(`${t.title} - ${data.referencia}`);
  pdf.setSubject(t.subtitle);
  pdf.setCreator("Peregrinação de Nossa Senhora da Cristandade");
  return pdf.save();
}
