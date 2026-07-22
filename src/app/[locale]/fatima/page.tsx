import { getTranslations } from "next-intl/server";
import { ArticleLayout } from "@/components/ArticleLayout";

const BASE_URL = "https://nscportugal.com";
const LOCALES = ["pt", "en", "es", "fr", "it"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("fatima");
  const title = t("meta_title");
  const description = t("meta_desc");
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/fatima`,
      languages: Object.fromEntries([
        ...LOCALES.map(l => [l, `${BASE_URL}/${l}/fatima`]),
        ["x-default", `${BASE_URL}/pt/fatima`],
      ]),
    },
    openGraph: {
      title,
      description,
      type: "website" as const,
      url: `${BASE_URL}/${locale}/fatima`,
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

function Aparicao({ data, children }: { data: string; children: React.ReactNode }) {
  return (
    <div className="relative pl-10 pb-10 last:pb-0">
      <div className="absolute left-[7px] top-3 bottom-0 w-px bg-gold/25 last:hidden" />
      <div className="absolute left-0 top-2 w-3.5 h-3.5 rounded-full border-2 border-gold bg-cream-100" />
      <div className="font-display text-[10px] tracking-[0.25em] uppercase text-gold mb-2 leading-none">
        {data}
      </div>
      <p className="font-serif text-base text-petrol/75 leading-relaxed">{children}</p>
    </div>
  );
}

export default async function FatimaPage() {
  const t = await getTranslations("fatima");

  return (
    <ArticleLayout
      pretitulo={t("pretitulo")}
      titulo={t("titulo")}
      subtitulo={t("subtitulo")}
    >
      <p className="versal font-serif text-xl text-petrol/80 leading-relaxed mb-8 text-pretty">
        {t.rich("intro", {
          em: (chunks) => <em>{chunks}</em>,
        })}
      </p>

      <Section titulo={t("apar1917_titulo")}>
        <div className="pt-2">
          {(["ap1", "ap2", "ap3", "ap4", "ap5", "ap6"] as const).map((key) => (
            <Aparicao key={key} data={t(`${key}_data` as Parameters<typeof t>[0])}>
              {t.rich(`${key}_texto` as Parameters<typeof t>[0], {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </Aparicao>
          ))}
        </div>
      </Section>

      <Section titulo={t("apar_post_titulo")}>
        <div className="pt-2">
          {(["pp1", "pp2", "pp3"] as const).map((key) => (
            <Aparicao key={key} data={t(`${key}_data` as Parameters<typeof t>[0])}>
              {t.rich(`${key}_texto` as Parameters<typeof t>[0], {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </Aparicao>
          ))}
        </div>
      </Section>

      <Section titulo={t("devocao_titulo")}>
        <p>{t("devocao_p1")}</p>
        <p>{t("devocao_p2")}</p>
      </Section>
    </ArticleLayout>
  );
}
