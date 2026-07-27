import { mkdir, writeFile } from "node:fs/promises";
import { gerarBilhetePdf } from "../src/lib/ticket-pdf";

async function main() {
  const output = "output/pdf/bilhete-exemplo.pdf";
  await mkdir("output/pdf", { recursive: true });
  await writeFile(output, await gerarBilhetePdf({
  referencia: "PNSCEXEMPLO2026",
  token: "37f0450e-e559-4b22-a42a-23f38ed72b58",
  locale: "pt",
  estadoVida: "leigo",
  tipoInscricao: "familia",
  rota: "familias",
  email: "familia.exemplo@example.com",
  telefone: "+351 912 345 678",
  afiliacao: null,
  totalCentimos: 16000,
  confirmadoEm: "2026-07-25T15:00:00.000Z",
  participantes: [
    {
      nome: "Maria",
      apelido: "da Conceição Silva",
      dataNascimento: "1984-03-12",
      nacionalidade: "PT",
      principal: true,
      servicos: ["dormida_nazare", "transporte_nazare"],
    },
    {
      nome: "João",
      apelido: "Silva",
      dataNascimento: "2012-08-23",
      nacionalidade: "PT",
      principal: false,
      servicos: ["dormida_nazare"],
    },
    {
      nome: "Francisca",
      apelido: "Silva",
      dataNascimento: "2017-11-04",
      nacionalidade: "PT",
      principal: false,
      servicos: [],
    },
  ],
  }));
  console.log(output);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
