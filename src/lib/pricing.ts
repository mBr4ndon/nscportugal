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
  extrasCentimos: number;
  totalCentimos: number;
  rota: "adultos" | "familias";
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
  if (portugues) return idade < 25 ? 4_500 : 5_500;
  return idade < 25 ? 3_500 : 4_500;
}

function calcularExtras(servicos: ServicosData): number {
  return Object.values(servicos).filter(Boolean).length * PRECO_SERVICO_CENTIMOS;
}

export function calcularInscricao(data: InscricaoData, referencia = new Date()): CalculoInscricao {
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
      extrasCentimos: calcularExtras(participante.servicos),
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

  return {
    participantes,
    subtotalCentimos,
    limiteFamiliaCentimos,
    descontoFamiliaCentimos: subtotalCentimos - baseCentimos,
    baseCentimos,
    extrasCentimos,
    totalCentimos: baseCentimos + extrasCentimos,
    rota: data.tipoInscricao === "familia" ? "familias" : "adultos",
  };
}

export function formatarEuros(centimos: number, locale = "pt-PT"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(centimos / 100);
}
