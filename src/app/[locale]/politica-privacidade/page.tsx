import { LegalDocument } from "@/components/LegalDocument";
import { getLegalContent } from "@/content/legal";

const BASE_URL = "https://nscportugal.com";
const LOCALES = ["pt", "en", "es", "fr", "it"];
const PATH = "/politica-privacidade";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const document = getLegalContent(locale).privacy;
  return {
    title: document.metaTitle,
    description: document.metaDescription,
    alternates: {
      canonical: `${BASE_URL}/${locale}${PATH}`,
      languages: Object.fromEntries([
        ...LOCALES.map((language) => [language, `${BASE_URL}/${language}${PATH}`]),
        ["x-default", `${BASE_URL}/pt${PATH}`],
      ]),
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LegalDocument document={getLegalContent(locale).privacy} />;
}
