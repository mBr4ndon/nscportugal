import { z } from "zod";

export const estadoVidaEnum = z.enum(["leigo", "sacerdote", "religioso"]);
export const tipoInscricaoEnum = z.enum(["individual", "familia"]);

const telefoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9][0-9\s()-]{6,20}$/, "Indique o número com o código do país (ex.: +351 912 345 678)");

const dataNascimentoSchema = z.string().date("Data de nascimento inválida").refine(
  (value) => new Date(`${value}T00:00:00Z`) <= new Date(),
  "A data de nascimento não pode estar no futuro",
);

export const servicosSchema = z.object({
  dormidaNazare: z.boolean().default(false),
  dormidaFatima: z.boolean().default(false),
  transporteNazare: z.boolean().default(false),
});

export const membroFamiliaSchema = z.object({
  nome: z.string().trim().min(1, "Nome obrigatório").max(100),
  apelido: z.string().trim().min(1, "Apelido obrigatório").max(100),
  dataNascimento: dataNascimentoSchema,
  nacionalidade: z.string().length(2, "Seleccione uma nacionalidade").transform((v) => v.toUpperCase()),
  servicos: servicosSchema,
});

export const inscricaoSchema = z
  .object({
    nome: z.string().trim().min(1, "Nome obrigatório").max(100),
    apelido: z.string().trim().min(1, "Apelido obrigatório").max(100),
    dataNascimento: dataNascimentoSchema,
    email: z.string().trim().toLowerCase().email("Correio electrónico inválido"),
    telefone: telefoneSchema,
    nacionalidade: z.string().length(2, "Seleccione uma nacionalidade").transform((v) => v.toUpperCase()),
    morada: z.string().trim().min(5, "Morada obrigatória").max(250),
    codigoPostal: z.string().trim().min(3, "Código postal obrigatório").max(20),
    localidade: z.string().trim().min(2, "Localidade obrigatória").max(100),
    contactoEmergenciaNome: z.string().trim().min(3, "Nome obrigatório").max(150),
    contactoEmergenciaTelefone: telefoneSchema,
    estadoVida: estadoVidaEnum,
    tipoInscricao: tipoInscricaoEnum,
    afiliacaoTipo: z.enum(["diocese", "instituto", "congregacao", "ordem", "outro"]).optional(),
    afiliacaoNome: z.string().trim().max(200).optional(),
    servicos: servicosSchema,
    membrosFamilia: z.array(membroFamiliaSchema).default([]),
    aceitaRegulamento: z.literal(true, { errorMap: () => ({ message: "Deve aceitar o regulamento" }) }),
    aceitaRGPD: z.literal(true, { errorMap: () => ({ message: "Deve aceitar a política de privacidade" }) }),
    autorizaImagem: z.boolean().default(false),
    locale: z.string().max(10).default("pt"),
  })
  .superRefine((data, ctx) => {
    if (data.estadoVida !== "leigo") {
      if (!data.afiliacaoTipo) ctx.addIssue({ code: "custom", path: ["afiliacaoTipo"], message: "Seleccione o tipo de instituição" });
      if (!data.afiliacaoNome) ctx.addIssue({ code: "custom", path: ["afiliacaoNome"], message: "Indique a instituição a que pertence" });
      if (data.tipoInscricao !== "individual") ctx.addIssue({ code: "custom", path: ["tipoInscricao"], message: "Sacerdotes e religiosos têm inscrição individual" });
    }
    if (data.estadoVida === "leigo" && data.tipoInscricao === "familia" && data.membrosFamilia.length < 1) {
      ctx.addIssue({ code: "custom", path: ["membrosFamilia"], message: "Adicione pelo menos mais um membro da família" });
    }
    if (data.tipoInscricao === "individual" && data.membrosFamilia.length > 0) {
      ctx.addIssue({ code: "custom", path: ["membrosFamilia"], message: "Uma inscrição individual só pode ter um participante" });
    }
  });

export type InscricaoData = z.infer<typeof inscricaoSchema>;
export type MembroFamiliaData = z.infer<typeof membroFamiliaSchema>;
export type ServicosData = z.infer<typeof servicosSchema>;

export const PRECO_SERVICO_CENTIMOS = 500;
export const LIMITE_FAMILIA_NACIONAL_CENTIMOS = 20_000;
export const LIMITE_FAMILIA_INTERNACIONAL_CENTIMOS = 15_000;
