import {
  LIMITE_FAMILIA_INTERNACIONAL_CENTIMOS,
  LIMITE_FAMILIA_NACIONAL_CENTIMOS,
  PRECO_SERVICO_CENTIMOS,
  type InscricaoData,
  type ServicosData,
} from "@/types/inscricao";

export interface LinhaPrecoParticipante {
  nome: string;
  idade: number;
  nacionalidade: string;
  precoIndividualCentimos: number;
  extrasCentimos: number;
}

export interface CalculoInscricao {
  participantes: LinhaPrecoParticipante[];
  subtotalCentimos: number;
  limiteFamiliaCentimos: number | null;
  descontoFamiliaCentimos: number;
  baseCentimos: number;
  tipoDescontoPromocional: "percentage" | "fixed" | null;
  valorDescontoPromocional: number;
  descontoPromocionalCentimos: number;
  extrasCentimos: number;
  totalSemDonativoCentimos: number;
  donativoCentimos: number;
  totalCentimos: number;
  rota: "adultos" | "familias";
}

export interface DescontoPromocional {
  type: "percentage" | "fixed";
  value: number;
}

export function calcularIdade(dataNascimento: string, referencia = new Date()): number {
  const [ano, mes, dia] = dataNascimento.split("-").map(Number);
  let idade = referencia.getUTCFullYear() - ano;
  const mesAtual = referencia.getUTCMonth() + 1;
  const diaAtual = referencia.getUTCDate();
  if (mesAtual < mes || (mesAtual === mes && diaAtual < dia)) idade--;
  return idade;
}

export function calcularPrecoIndividual(nacionalidade: string, idade: number): number {
  const portugues = nacionalidade.toUpperCase() === "PT";
  if (portugues) return idade <= 25 ? 4_500 : 5_500;
  return idade <= 25 ? 3_500 : 4_500;
}

function calcularExtras(servicos: ServicosData): number {
  return Object.values(servicos).filter(Boolean).length * PRECO_SERVICO_CENTIMOS;
}

function calcularDonativo(
  opcao: InscricaoData["donativo"],
  totalSemDonativoCentimos: number,
  valorCustomEuros?: number,
): number {
  if (opcao === "round_up") {
    return (100 - totalSemDonativoCentimos % 100) % 100;
  }
  if (opcao === "500" || opcao === "1000" || opcao === "2500") {
    return Number(opcao);
  }
  if (opcao === "custom" && valorCustomEuros) {
    return Math.round(valorCustomEuros * 100);
  }
  return 0;
}

export function calcularInscricao(
  data: InscricaoData,
  referencia = new Date(),
  descontoPromocional: DescontoPromocional | null = null,
): CalculoInscricao {
  const participantes = [
    {
      nome: `${data.nome} ${data.apelido}`,
      dataNascimento: data.dataNascimento,
      nacionalidade: data.nacionalidade,
      servicos: data.servicos,
      principal: true,
    },
    ...data.membrosFamilia.map((membro) => ({ ...membro, principal: false })),
  ].map((participante) => {
    const idade = calcularIdade(participante.dataNascimento, referencia);
    const isento = participante.principal && data.estadoVida !== "leigo";
    return {
      nome: participante.nome,
      idade,
      nacionalidade: participante.nacionalidade,
      precoIndividualCentimos: isento ? 0 : calcularPrecoIndividual(participante.nacionalidade, idade),
      extrasCentimos: participante.principal && data.estadoVida === "sacerdote"
        ? 0
        : calcularExtras(participante.servicos),
    };
  });

  const subtotalCentimos = participantes.reduce((total, p) => total + p.precoIndividualCentimos, 0);
  const limiteFamiliaCentimos = data.tipoInscricao === "familia"
    ? data.nacionalidade === "PT"
      ? LIMITE_FAMILIA_NACIONAL_CENTIMOS
      : LIMITE_FAMILIA_INTERNACIONAL_CENTIMOS
    : null;
  const baseCentimos = limiteFamiliaCentimos === null
    ? subtotalCentimos
    : Math.min(subtotalCentimos, limiteFamiliaCentimos);
  const extrasCentimos = participantes.reduce((total, p) => total + p.extrasCentimos, 0);
  const valorDescontoSeguro = descontoPromocional?.type === "percentage"
    ? Math.min(100, Math.max(0, Math.trunc(descontoPromocional.value)))
    : descontoPromocional?.type === "fixed"
      ? Math.max(0, Math.trunc(descontoPromocional.value))
      : 0;
  const descontoPromocionalCentimos = descontoPromocional?.type === "percentage"
    ? Math.min(baseCentimos, Math.round(baseCentimos * valorDescontoSeguro / 100))
    : descontoPromocional?.type === "fixed"
      ? Math.max(0, baseCentimos - Math.min(baseCentimos, valorDescontoSeguro))
      : 0;
  const totalSemDonativoCentimos = baseCentimos
    - descontoPromocionalCentimos
    + extrasCentimos;
  const donativoCentimos = calcularDonativo(
    data.donativo,
    totalSemDonativoCentimos,
    data.donativoCustomEuros,
  );

  return {
    participantes,
    subtotalCentimos,
    limiteFamiliaCentimos,
    descontoFamiliaCentimos: subtotalCentimos - baseCentimos,
    baseCentimos,
    tipoDescontoPromocional: descontoPromocional?.type ?? null,
    valorDescontoPromocional: valorDescontoSeguro,
    descontoPromocionalCentimos,
    extrasCentimos,
    totalSemDonativoCentimos,
    donativoCentimos,
    totalCentimos: totalSemDonativoCentimos + donativoCentimos,
    rota: data.rota,
  };
}

export function formatarEuros(centimos: number, locale = "pt-PT"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(centimos / 100);
}
