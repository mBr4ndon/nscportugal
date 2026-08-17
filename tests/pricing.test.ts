import assert from "node:assert/strict";
import test from "node:test";
import { calcularInscricao } from "../src/lib/pricing";
import { inscricaoSchema, type InscricaoData } from "../src/types/inscricao";

const referencia = new Date("2026-07-22T12:00:00Z");

function inscricao(overrides: Partial<InscricaoData> = {}): InscricaoData {
  return inscricaoSchema.parse({
    nome: "Maria", apelido: "Silva", dataNascimento: "1990-01-01",
    email: "maria@example.com", telefone: "+351 912345678", nacionalidade: "PT",
    estadoVida: "leigo", tipoInscricao: "individual", rota: "adultos",
    servicos: {}, membrosFamilia: [],
    aceitaRegulamento: true, aceitaRGPD: true,
    ...overrides,
  });
}

const membro = (nome: string, nacionalidade = "PT", dataNascimento = "1990-01-01") => ({
  nome, apelido: "Teste", dataNascimento, nacionalidade,
  servicos: { dormidaNazare: false, dormidaFatima: false, transporteNazare: false },
});

test("aplica 55 € a português com mais de 25 anos", () => {
  assert.equal(calcularInscricao(inscricao(), referencia).totalCentimos, 5_500);
});

test("inclui quem tem exatamente 25 anos no escalão jovem", () => {
  const dataNascimento = "2001-07-22";
  assert.equal(calcularInscricao(inscricao({ dataNascimento }), referencia).totalCentimos, 4_500);
  assert.equal(
    calcularInscricao(inscricao({ dataNascimento, nacionalidade: "ES" }), referencia).totalCentimos,
    3_500,
  );
});

test("limita família portuguesa a 200 € mesmo com membros internacionais", () => {
  const data = inscricao({
    tipoInscricao: "familia",
    membrosFamilia: [membro("A"), membro("B"), membro("C", "FR"), membro("D")],
  });
  const result = calcularInscricao(data, referencia);
  assert.equal(result.limiteFamiliaCentimos, 20_000);
  assert.equal(result.baseCentimos, 20_000);
});

test("usa limite internacional quando apenas o responsável é internacional", () => {
  const data = inscricao({
    nacionalidade: "FR", tipoInscricao: "familia",
    membrosFamilia: [membro("A"), membro("B"), membro("C")],
  });
  const result = calcularInscricao(data, referencia);
  assert.equal(result.limiteFamiliaCentimos, 15_000);
  assert.equal(result.baseCentimos, 15_000);
});

test("serviços são cobrados por participante fora do limite familiar", () => {
  const data = inscricao({
    tipoInscricao: "familia", servicos: { dormidaNazare: true, dormidaFatima: true, transporteNazare: true },
    membrosFamilia: [membro("A"), membro("B"), membro("C"), { ...membro("D"), servicos: { dormidaNazare: true, dormidaFatima: false, transporteNazare: false } }],
  });
  const result = calcularInscricao(data, referencia);
  assert.equal(result.baseCentimos, 20_000);
  assert.equal(result.extrasCentimos, 2_000);
  assert.equal(result.totalCentimos, 22_000);
});

test("código percentual desconta a peregrinação mas não os serviços", () => {
  const data = inscricao({
    servicos: {
      dormidaNazare: true,
      dormidaFatima: true,
      transporteNazare: false,
    },
  });
  const result = calcularInscricao(data, referencia, { type: "percentage", value: 100 });
  assert.equal(result.baseCentimos, 5_500);
  assert.equal(result.descontoPromocionalCentimos, 5_500);
  assert.equal(result.extrasCentimos, 1_000);
  assert.equal(result.totalCentimos, 1_000);
});

test("código percentual é aplicado depois do limite familiar", () => {
  const data = inscricao({
    tipoInscricao: "familia",
    membrosFamilia: [membro("A"), membro("B"), membro("C"), membro("D")],
  });
  const result = calcularInscricao(data, referencia, { type: "percentage", value: 25 });
  assert.equal(result.baseCentimos, 20_000);
  assert.equal(result.descontoPromocionalCentimos, 5_000);
  assert.equal(result.totalCentimos, 15_000);
});

test("donativo por arredondamento completa o próximo euro", () => {
  const result = calcularInscricao(
    inscricao({ donativo: "round_up" }),
    referencia,
    { type: "percentage", value: 33 },
  );
  assert.equal(result.totalSemDonativoCentimos, 3_685);
  assert.equal(result.donativoCentimos, 15);
  assert.equal(result.totalCentimos, 3_700);
});

test("código de desconto não reduz o donativo", () => {
  const result = calcularInscricao(
    inscricao({ donativo: "500" }),
    referencia,
    { type: "percentage", value: 50 },
  );
  assert.equal(result.descontoPromocionalCentimos, 2_750);
  assert.equal(result.donativoCentimos, 500);
  assert.equal(result.totalCentimos, 3_250);
});

test("aceita donativo personalizado e converte euros em cêntimos", () => {
  const result = calcularInscricao(
    inscricao({ donativo: "custom", donativoCustomEuros: 12.34 }),
    referencia,
    { type: "percentage", value: 50 },
  );
  assert.equal(result.donativoCentimos, 1_234);
  assert.equal(result.totalCentimos, 3_984);
});

test("código de preço fixo define o preço final da componente de inscrição", () => {
  const result = calcularInscricao(
    inscricao(),
    referencia,
    { type: "fixed", value: 1_000 },
  );
  assert.equal(result.baseCentimos, 5_500);
  assert.equal(result.descontoPromocionalCentimos, 4_500);
  assert.equal(result.totalCentimos, 1_000);
});

test("código de preço fixo nunca aumenta o preço base", () => {
  const result = calcularInscricao(
    inscricao({
      servicos: { dormidaNazare: true, dormidaFatima: false, transporteNazare: false },
    }),
    referencia,
    { type: "fixed", value: 10_000 },
  );
  assert.equal(result.descontoPromocionalCentimos, 0);
  assert.equal(result.extrasCentimos, 500);
  assert.equal(result.totalCentimos, 6_000);
});

test("preço fixo é aplicado depois do limite familiar sem afetar extras ou donativo", () => {
  const result = calcularInscricao(
    inscricao({
      tipoInscricao: "familia",
      membrosFamilia: [membro("A"), membro("B"), membro("C"), membro("D")],
      servicos: { dormidaNazare: true, dormidaFatima: false, transporteNazare: false },
      donativo: "500",
    }),
    referencia,
    { type: "fixed", value: 3_000 },
  );
  assert.equal(result.baseCentimos, 20_000);
  assert.equal(result.descontoPromocionalCentimos, 17_000);
  assert.equal(result.extrasCentimos, 500);
  assert.equal(result.donativoCentimos, 500);
  assert.equal(result.totalCentimos, 4_000);
});

test("sacerdote é isento, incluindo os serviços pedidos", () => {
  const data = inscricao({
    estadoVida: "sacerdote", afiliacaoNome: "Diocese de Lisboa", rota: "familias",
    servicos: { dormidaNazare: true, dormidaFatima: false, transporteNazare: true },
  });
  const result = calcularInscricao(data, referencia);
  assert.equal(result.baseCentimos, 0);
  assert.equal(result.extrasCentimos, 0);
  assert.equal(result.totalCentimos, 0);
  assert.equal(result.rota, "familias");
});

test("a rota é uma escolha independente do tipo de inscrição", () => {
  const individual = calcularInscricao(inscricao({ rota: "familias" }), referencia);
  const familia = calcularInscricao(inscricao({
    tipoInscricao: "familia",
    rota: "adultos",
    membrosFamilia: [membro("A")],
  }), referencia);
  assert.equal(individual.rota, "familias");
  assert.equal(familia.rota, "adultos");
});

test("aceita responsável que completa 16 anos no início da peregrinação", () => {
  assert.equal(inscricaoSchema.safeParse({
    ...inscricao(),
    dataNascimento: "2010-10-10",
  }).success, true);
});

test("rejeita responsável que só completa 16 anos depois do início", () => {
  const result = inscricaoSchema.safeParse({
    ...inscricao(),
    dataNascimento: "2010-10-11",
  });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(
      result.error.issues.some((issue) =>
        issue.path.join(".") === "dataNascimento"
        && issue.message === "O responsável deve ter pelo menos 16 anos no início da peregrinação"
      ),
      true,
    );
  }
});
