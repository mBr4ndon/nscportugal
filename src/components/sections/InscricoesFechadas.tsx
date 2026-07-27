import { CalendarDays, Mail, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function InscricoesFechadas() {
  const t = await getTranslations("inscricao");

  return (
    <section id="inscricao" className="relative overflow-hidden bg-cream-50 py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(176,141,87,0.16) 0%, transparent 55%)",
        }}
      />
      <div className="container relative mx-auto max-w-4xl px-6 text-center">
        <p className="mb-5 font-display text-[11px] uppercase tracking-[0.4em] text-gold">
          {t("em_breve_label")}
        </p>
        <h2 className="mb-6 font-display text-5xl font-light text-petrol md:text-6xl">
          {t("em_breve_titulo")}
        </h2>
        <p className="mx-auto mb-12 max-w-2xl font-serif text-lg leading-relaxed text-petrol/70">
          {t("em_breve_texto")}
        </p>

        <div className="mx-auto mb-10 grid max-w-2xl gap-px overflow-hidden border border-petrol/10 bg-petrol/10 sm:grid-cols-2">
          <div className="bg-cream-100 px-7 py-8">
            <CalendarDays className="mx-auto mb-4 text-gold" size={22} />
            <p className="mb-2 font-display text-[10px] uppercase tracking-[0.25em] text-petrol/50">
              {t("em_breve_data_label")}
            </p>
            <p className="font-serif text-lg text-petrol">{t("em_breve_data_valor")}</p>
          </div>
          <div className="bg-cream-100 px-7 py-8">
            <MapPin className="mx-auto mb-4 text-gold" size={22} />
            <p className="mb-2 font-display text-[10px] uppercase tracking-[0.25em] text-petrol/50">
              {t("em_breve_percurso_label")}
            </p>
            <p className="font-serif text-lg text-petrol">Nazaré → Fátima</p>
          </div>
        </div>

        <p className="font-serif text-sm text-petrol/60">
          {t("em_breve_contacto")}{" "}
          <a
            href="mailto:infonscportugal@gmail.com"
            className="inline-flex items-center gap-2 text-petrol underline decoration-gold underline-offset-4 transition-colors hover:text-gold"
          >
            <Mail size={14} />
            infonscportugal@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
