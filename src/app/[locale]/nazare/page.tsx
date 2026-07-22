import { getTranslations } from "next-intl/server";
import { ArticleLayout } from "@/components/ArticleLayout";

const BASE_URL = "https://nscportugal.com";
const LOCALES = ["pt", "en", "es", "fr", "it"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("nazare");
  const title = t("meta_title");
  const description = t("meta_desc");
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/nazare`,
      languages: Object.fromEntries([
        ...LOCALES.map(l => [l, `${BASE_URL}/${l}/nazare`]),
        ["x-default", `${BASE_URL}/pt/nazare`],
      ]),
    },
    openGraph: {
      title,
      description,
      type: "website" as const,
      url: `${BASE_URL}/${locale}/nazare`,
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

export default async function NazarePage() {
  const t = await getTranslations("nazare");

  return (
    <ArticleLayout
      pretitulo={t("pretitulo")}
      titulo={t("titulo")}
      subtitulo={t("subtitulo")}
    >
      <p className="versal font-serif text-xl text-petrol/80 leading-relaxed mb-16 text-pretty">
        {t("intro")}
      </p>

      <Section titulo={t("s1_titulo")}>
        <p>{t("s1_p1")}</p>
        <p>
          {t.rich("s1_p2", {
            em: (chunks) => <em>{chunks}</em>,
          })}
        </p>
      </Section>

      <Section titulo={t("s2_titulo")}>
        <p>
          {t.rich("s2_p1", {
            em: (chunks) => <em>{chunks}</em>,
          })}
        </p>
        <p>{t("s2_p2")}</p>
        <p>{t("s2_p3")}</p>
      </Section>

      <Section titulo={t("s3_titulo")}>
        <p>{t("s3_p1")}</p>
        <p>{t("s3_p2")}</p>
        <p>{t("s3_p3")}</p>
        <p>{t("s3_p4")}</p>
      </Section>
    </ArticleLayout>
  );
}
