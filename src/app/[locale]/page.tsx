import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Sobre } from "@/components/sections/Sobre";
import { Historia } from "@/components/sections/Historia";
import { Percurso } from "@/components/sections/Percurso";
import { Programa } from "@/components/sections/Programa";
import { Galeria } from "@/components/sections/Galeria";
import { Inscricao } from "@/components/sections/Inscricao";
import { InscricoesFechadas } from "@/components/sections/InscricoesFechadas";
import { Capitulos } from "@/components/sections/Capitulos";
import { FAQ } from "@/components/sections/FAQ";
import { Contactos } from "@/components/sections/Contactos";
import { registrationsEnabled } from "@/lib/features";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ pagamento?: string }>;
}) {
  const { pagamento } = await searchParams;

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Sobre />
        <Historia />
        <Percurso />
        <Programa />
        <Galeria />
        {registrationsEnabled()
          ? <Inscricao pagamentoCancelado={pagamento === "cancelado"} />
          : <InscricoesFechadas />}
        <Capitulos />
        <FAQ />
        <Contactos />
      </main>
      <Footer />
    </>
  );
}
