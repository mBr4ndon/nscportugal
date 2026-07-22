import { getTranslations } from "next-intl/server";
import { ArticleLayout } from "@/components/ArticleLayout";

const BASE_URL = "https://nscportugal.com";
const LOCALES = ["pt", "en", "es", "fr", "it"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("missa");
  const title = t("meta_title");
  const description = t("meta_desc");
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/missa`,
      languages: Object.fromEntries([
        ...LOCALES.map(l => [l, `${BASE_URL}/${l}/missa`]),
        ["x-default", `${BASE_URL}/pt/missa`],
      ]),
    },
    openGraph: {
      title,
      description,
      type: "website" as const,
      url: `${BASE_URL}/${locale}/missa`,
      siteName: "Peregrinação de Nossa Senhora da Cristandade",
      images: [{ url: `${BASE_URL}/images/hero.jpeg`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image" as const, title, description, images: [`${BASE_URL}/images/hero.jpeg`] },
  };
}

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <div className="w-10 h-px bg-gold mb-6" />
      <h2 className="font-display text-3xl md:text-4xl text-petrol font-light mb-6 leading-tight">
        {titulo}
      </h2>
      <div className="font-serif text-lg text-petrol/80 leading-relaxed space-y-5">
        {children}
      </div>
    </section>
  );
}

export default async function MissaPage() {
  const t = await getTranslations("missa");

  const fins = [
    { titulo: t("fim1_titulo"), descricao: t("fim1_desc") },
    { titulo: t("fim2_titulo"), descricao: t("fim2_desc") },
    { titulo: t("fim3_titulo"), descricao: t("fim3_desc") },
    { titulo: t("fim4_titulo"), descricao: t("fim4_desc") },
  ];

  return (
    <ArticleLayout
      pretitulo={t("pretitulo")}
      titulo={t("titulo")}
      subtitulo={t("subtitulo")}
    >
      <div className="mb-16">
        <p className="versal font-serif text-xl text-petrol/80 leading-relaxed mb-8 text-pretty">
          {t("intro")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-petrol/10 border border-petrol/10 overflow-hidden">
          {fins.map((fim) => (
            <div key={fim.titulo} className="bg-cream-100 px-6 py-8 text-center">
              <div className="w-8 h-px bg-gold mx-auto mb-5" />
              <h3 className="font-display text-sm tracking-[0.15em] uppercase text-petrol mb-3">
                {fim.titulo}
              </h3>
              <p className="font-serif text-sm text-petrol/65 leading-relaxed">
                {fim.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="font-serif text-xl text-petrol/80 leading-relaxed mb-16 text-pretty">
        {t("p2")}
      </p>

      <Section titulo={t("s1_titulo")}>
        <p>
          {t.rich("s1_p1", {
            em: (chunks) => <em>{chunks}</em>,
          })}
        </p>
        <p>{t("s1_p2")}</p>
      </Section>

      <Section titulo={t("s2_titulo")}>
        <p>{t("s2_p1")}</p>
      </Section>

      <Section titulo={t("s3_titulo")}>
        <p>{t("s3_p1")}</p>
        <p>{t("s3_p2")}</p>
      </Section>

      <Section titulo={t("s4_titulo")}>
        <p>
          {t.rich("s4_p1", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <p>
          {t.rich("s4_p2", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </Section>
    </ArticleLayout>
  );
}
