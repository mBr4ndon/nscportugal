import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Cinzel, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const BASE_URL = "https://nscportugal.com";

const META: Record<string, { title: string; description: string; keywords: string[]; ogLocale: string }> = {
  pt: {
    title: "Peregrinação de Nossa Senhora da Cristandade — Portugal 2026",
    description: "Peregrinação católica tradicional de Nazaré a Fátima no Rito Romano Tradicional. 10, 11 e 12 de Outubro de 2026. Caminhada de fé, oração e reparação no coração de Portugal.",
    keywords: ["peregrinação", "Nossa Senhora da Cristandade", "Fátima", "Nazaré", "Rito Romano Tradicional", "Missa Tridentina", "peregrinação católica Portugal 2026", "peregrinação Fátima", "ISNSM"],
    ogLocale: "pt_PT",
  },
  en: {
    title: "Pilgrimage of Our Lady of Christendom — Portugal 2026",
    description: "Traditional Catholic pilgrimage from Nazaré to Fátima in the Traditional Roman Rite. 10, 11 and 12 October 2026. A journey of faith, prayer and reparation in the heart of Portugal.",
    keywords: ["pilgrimage", "Our Lady of Christendom", "Fatima", "Nazare", "Traditional Roman Rite", "Tridentine Mass", "Catholic pilgrimage Portugal 2026"],
    ogLocale: "en_GB",
  },
  es: {
    title: "Peregrinación de Nuestra Señora de la Cristiandad — Portugal 2026",
    description: "Peregrinación católica tradicional de Nazaré a Fátima en el Rito Romano Tradicional. 10, 11 y 12 de octubre de 2026. Una caminata de fe, oración y reparación en el corazón de Portugal.",
    keywords: ["peregrinación", "Nuestra Señora de la Cristiandad", "Fátima", "Rito Romano Tradicional", "Misa Tridentina", "peregrinación católica Portugal 2026"],
    ogLocale: "es_ES",
  },
  fr: {
    title: "Pèlerinage de Notre-Dame de la Chrétienté — Portugal 2026",
    description: "Pèlerinage catholique traditionnel de Nazaré à Fátima selon le Rite Romain Traditionnel. 10, 11 et 12 octobre 2026. Une marche de foi, de prière et de réparation au cœur du Portugal.",
    keywords: ["pèlerinage", "Notre-Dame de la Chrétienté", "Fátima", "Rite Romain Traditionnel", "Messe Tridentine", "pèlerinage catholique Portugal 2026"],
    ogLocale: "fr_FR",
  },
  it: {
    title: "Pellegrinaggio di Nostra Signora della Cristianità — Portogallo 2026",
    description: "Pellegrinaggio cattolico tradizionale da Nazaré a Fátima nel Rito Romano Tradizionale. 10, 11 e 12 ottobre 2026. Un cammino di fede, preghiera e riparazione nel cuore del Portogallo.",
    keywords: ["pellegrinaggio", "Nostra Signora della Cristianità", "Fátima", "Rito Romano Tradizionale", "Messa Tridentina", "pellegrinaggio cattolico Portogallo 2026"],
    ogLocale: "it_IT",
  },
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.pt;

  return {
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    authors: [{ name: "Instituto São Nuno de Santa Maria" }],
    icons: { icon: "/images/logo.png", apple: "/images/logo.png" },
    verification: { google: "_2Lj7m7cCk2jLF-fZ3Q9-BiobCCPavJBvIOSKTAYBqo" },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        pt: `${BASE_URL}/pt`,
        en: `${BASE_URL}/en`,
        es: `${BASE_URL}/es`,
        fr: `${BASE_URL}/fr`,
        it: `${BASE_URL}/it`,
        "x-default": `${BASE_URL}/pt`,
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      type: "website",
      url: `${BASE_URL}/${locale}`,
      locale: m.ogLocale,
      alternateLocale: Object.values(META).filter(x => x.ogLocale !== m.ogLocale).map(x => x.ogLocale),
      siteName: "Peregrinação de Nossa Senhora da Cristandade",
      images: [{ url: `${BASE_URL}/images/hero.jpeg`, width: 1200, height: 630, alt: m.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: [`${BASE_URL}/images/hero.jpeg`],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${cinzel.variable} ${inter.variable}`}
    >
      <body className="font-serif">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Peregrinação de Nossa Senhora da Cristandade",
                alternateName: "ISNSM",
                url: BASE_URL,
                logo: `${BASE_URL}/images/logo.png`,
                contactPoint: { "@type": "ContactPoint", email: "infonscportugal@gmail.com", contactType: "customer service" },
              },
              {
                "@context": "https://schema.org",
                "@type": "Event",
                name: "Peregrinação de Nossa Senhora da Cristandade 2026",
                description: "Peregrinação católica tradicional de Nazaré a Fátima no Rito Romano Tradicional. Outubro de 2026.",
                startDate: "2026-10-10",
                endDate: "2026-10-12",
                eventStatus: "https://schema.org/EventScheduled",
                eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
                location: {
                  "@type": "Place",
                  name: "Nazaré — Fátima, Portugal",
                  address: { "@type": "PostalAddress", addressCountry: "PT" },
                },
                organizer: { "@type": "Organization", name: "Instituto São Nuno de Santa Maria", url: BASE_URL },
                url: BASE_URL,
                image: `${BASE_URL}/images/hero.jpeg`,
              },
            ]),
          }}
        />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
