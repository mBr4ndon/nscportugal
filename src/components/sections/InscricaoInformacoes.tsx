import { CalendarDays, Check, Info } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const INCLUDED_ITEMS = 7;

const IMPORTANT_NOTES = [
  "capitulos",
  "voluntarios",
  "dormidas",
  "banhos",
  "rotas",
  "alergias",
  "recheios",
  "dormidas_extra",
  "transportes",
  "recomendacao",
] as const;

export async function InscricaoInformacoes() {
  const t = await getTranslations("inscricoes_info");

  return (
    <section id="informacoes-inscricao" className="relative overflow-hidden bg-cream-50 py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 10% 20%, rgba(176,141,87,0.16) 0%, transparent 42%), radial-gradient(ellipse at 90% 80%, rgba(44,62,80,0.10) 0%, transparent 42%)",
        }}
      />

      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <header className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-4 font-display text-[11px] uppercase tracking-[0.32em] text-gold">
              {t("eyebrow")}
            </p>
            <h2 className="mb-6 font-display text-4xl font-light leading-tight text-petrol md:text-6xl">
              {t("titulo")}
            </h2>
            <div className="inline-flex items-center gap-3 border border-gold/35 bg-white/60 px-5 py-3 text-petrol">
              <CalendarDays className="text-gold" size={19} aria-hidden="true" />
              <span className="font-serif text-lg">{t("periodo")}</span>
            </div>
          </header>

          <div className="mb-16 grid gap-6 md:grid-cols-2">
            {(["nacional", "internacional"] as const).map((tipo) => (
              <article
                key={tipo}
                className="border border-petrol/10 bg-white/75 p-7 shadow-[0_18px_55px_rgba(44,62,80,0.08)] md:p-9"
              >
                <h3 className="mb-7 font-display text-2xl text-petrol">
                  {t(`preco_${tipo}`)}
                </h3>
                <dl className="divide-y divide-petrol/10 border-y border-petrol/10">
                  <div className="flex items-center justify-between gap-6 py-4">
                    <dt className="font-serif text-lg text-petrol/75">{t("mais_25")}</dt>
                    <dd className="font-display text-2xl text-gold">{t(`preco_${tipo}_mais`)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-6 py-4">
                    <dt className="font-serif text-lg text-petrol/75">{t("ate_25")}</dt>
                    <dd className="font-display text-2xl text-gold">{t(`preco_${tipo}_ate`)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-6 py-4">
                    <dt className="font-serif text-lg text-petrol/75">{t("maximo_familia")}</dt>
                    <dd className="font-display text-2xl text-gold">{t(`preco_${tipo}_familia`)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="bg-petrol p-7 text-cream-50 md:p-10">
              <h3 className="mb-7 font-display text-3xl font-light">{t("inclui_titulo")}</h3>
              <ul className="space-y-4">
                {Array.from({ length: INCLUDED_ITEMS }, (_, index) => (
                  <li key={index} className="flex gap-3 font-serif text-lg leading-relaxed text-cream-50/85">
                    <Check className="mt-1 shrink-0 text-gold" size={18} aria-hidden="true" />
                    <span>{t(`inclui_${index + 1}`)}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="border border-petrol/10 bg-white/75 p-7 md:p-10">
              <div className="mb-7 flex items-center gap-3">
                <Info className="text-gold" size={24} aria-hidden="true" />
                <h3 className="font-display text-3xl font-light text-petrol">{t("notas_titulo")}</h3>
              </div>
              <ul className="divide-y divide-petrol/10">
                {IMPORTANT_NOTES.map((nota) => (
                  <li key={nota} className="py-4 font-serif text-base leading-relaxed text-petrol/75 first:pt-0">
                    <strong className="font-semibold text-petrol">{t(`nota_${nota}_titulo`)}:</strong>{" "}
                    {t(`nota_${nota}_texto`)}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/#inscricao"
              className="inline-flex bg-gold px-8 py-4 font-display text-xs uppercase tracking-[0.22em] text-petrol transition-colors hover:bg-gold-light"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
