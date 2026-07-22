import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

interface ArticleLayoutProps {
  pretitulo: string;
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
}

export async function ArticleLayout({ pretitulo, titulo, subtitulo, children }: ArticleLayoutProps) {
  const t = await getTranslations("article");

  return (
    <>
      <Header />
      <main>
        {/* Hero banner */}
        <div className="relative bg-petrol pt-32 pb-20 overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 30% 60%, rgba(176,141,87,0.3) 0%, transparent 55%)",
            }}
          />
          <div className="relative container mx-auto px-6 max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-display text-[10px] tracking-[0.3em] uppercase text-cream-50/50 hover:text-gold transition-colors duration-200 mb-10"
            >
              <ArrowLeft className="w-3 h-3" />
              {t("voltar")}
            </Link>
            <p className="font-display text-[11px] tracking-[0.4em] uppercase text-gold mb-4">
              {pretitulo}
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-cream-50 font-light leading-tight text-balance mb-5">
              {titulo}
            </h1>
            {subtitulo && (
              <p className="font-serif text-xl text-cream-50/65 max-w-2xl leading-relaxed">
                {subtitulo}
              </p>
            )}
          </div>
        </div>

        {/* Conteúdo do artigo */}
        <article className="bg-cream-100 py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
