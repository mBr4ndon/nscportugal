import assert from "node:assert/strict";
import test from "node:test";
import { calcularInscricao } from "../src/lib/pricing";
import { inscricaoSchema, type InscricaoData } from "../src/types/inscricao";

const referencia = new Date("2026-07-22T12:00:00Z");

function inscricao(overrides: Partial<InscricaoData> = {}): InscricaoData {
  return inscricaoSchema.parse({
    nome: "Maria", apelido: "Silva", dataNascimento: "1990-01-01",
    email: "maria@example.com", telefone: "+351 912345678", nacionalidade: "PT",
    morada: "Rua Principal 1", codigoPostal: "1000-001", localidade: "Lisboa",
    contactoEmergenciaNome: "João Silva", contactoEmergenciaTelefone: "+351 911111111",
    estadoVida: "leigo", tipoInscricao: "individual", servicos: {}, membrosFamilia: [],
    aceitaRegulamento: true, aceitaRGPD: true,
    ...overrides,
  });
}

const membro = (nome: string, nacionalidade = "PT", dataNascimento = "1990-01-01") => ({
  nome, apelido: "Teste", dataNascimento, nacionalidade,
  servicos: { dormidaNazare: false, dormidaFatima: false, transporteNazare: false },
});

test("aplica 55 € a português com 25 ou mais anos", () => {
  assert.equal(calcularInscricao(inscricao(), referencia).totalCentimos, 5_500);
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

test("sacerdote é isento mas paga os serviços pedidos", () => {
  const data = inscricao({
    estadoVida: "sacerdote", afiliacaoTipo: "diocese", afiliacaoNome: "Lisboa",
    servicos: { dormidaNazare: true, dormidaFatima: false, transporteNazare: true },
  });
  const result = calcularInscricao(data, referencia);
  assert.equal(result.baseCentimos, 0);
  assert.equal(result.totalCentimos, 1_000);
  assert.equal(result.rota, "adultos");
});
