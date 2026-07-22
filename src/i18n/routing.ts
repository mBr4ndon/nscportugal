import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en", "fr", "es", "it"],
  defaultLocale: "pt",
});
