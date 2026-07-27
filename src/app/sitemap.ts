import { MetadataRoute } from "next";

const BASE_URL = "https://nscportugal.com";
const LOCALES = ["pt", "en", "es", "fr", "it"];

const PAGES: { path: string; priority: number; changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "",        priority: 1.0, changeFreq: "weekly"  },
  { path: "/fatima", priority: 0.8, changeFreq: "monthly" },
  { path: "/nazare", priority: 0.8, changeFreq: "monthly" },
  { path: "/missa",  priority: 0.8, changeFreq: "monthly" },
  { path: "/regulamento", priority: 0.5, changeFreq: "yearly" },
  { path: "/politica-privacidade", priority: 0.5, changeFreq: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of PAGES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map(l => [l, `${BASE_URL}/${l}${page.path}`])
          ),
        },
      });
    }
  }

  return entries;
}
