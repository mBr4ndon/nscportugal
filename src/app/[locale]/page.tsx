import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Sobre } from "@/components/sections/Sobre";
import { Historia } from "@/components/sections/Historia";
import { Percurso } from "@/components/sections/Percurso";
import { Programa } from "@/components/sections/Programa";
import { Galeria } from "@/components/sections/Galeria";
import { Inscricao } from "@/components/sections/Inscricao";
import { Capitulos } from "@/components/sections/Capitulos";
import { FAQ } from "@/components/sections/FAQ";
import { Contactos } from "@/components/sections/Contactos";

export default function Home() {
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
        <Inscricao />
        <Capitulos />
        <FAQ />
        <Contactos />
      </main>
      <Footer />
    </>
  );
}
