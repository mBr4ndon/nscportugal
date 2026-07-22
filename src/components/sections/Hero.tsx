import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative min-h-[78vh] flex items-center overflow-hidden bg-petrol">
      <Image
        src="/images/hero.jpeg"
        alt={t("img_alt")}
        fill
        priority
        className="object-cover object-center"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(44,62,80,1) 0%, rgba(44,62,80,0.95) 38%, rgba(44,62,80,0.70) 62%, rgba(44,62,80,0.20) 100%)",
        }}
      />

      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-petrol/75 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-petrol/65 to-transparent" />
      <div className="absolute inset-0 grain-overlay" />

      <div className="relative container mx-auto px-6 lg:px-16 pt-36 pb-16 sm:pb-24">
        <h1 className="font-serif text-[clamp(2.4rem,5.5vw,5rem)] text-cream-50 font-light leading-[1.12] italic mb-8 animate-fade-in">
          In viam pacis<br />dirige nos
        </h1>

        <div className="w-14 h-px bg-gold mb-6" />

        <p className="font-display text-[10px] tracking-[0.45em] uppercase text-gold/80 mb-10">
          {t("citacao_evangelho")}
        </p>

        <div className="flex flex-wrap items-center gap-x-10 gap-y-3 mb-12 text-cream-50/55">
          <div>
            <div className="font-display text-[10px] tracking-[0.3em] uppercase text-gold mb-1">
              {t("data_label")}
            </div>
            <div className="font-serif text-base">{t("data_valor")}</div>
          </div>
          <div className="hidden md:block w-px h-8 bg-cream-50/20" />
          <div>
            <div className="font-display text-[10px] tracking-[0.3em] uppercase text-gold mb-1">
              {t("percurso_label")}
            </div>
            <div className="font-serif text-base">{t("percurso_valor")}</div>
          </div>
          <div className="hidden md:block w-px h-8 bg-cream-50/20" />
          <div>
            <div className="font-display text-[10px] tracking-[0.3em] uppercase text-gold mb-1">
              {t("distancia_label")}
            </div>
            <div className="font-serif text-base">{t("distancia_valor")}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="#sobre"
            className="inline-flex items-center gap-3 px-8 py-4 border border-cream-50/35 text-cream-50 font-display tracking-[0.22em] text-xs uppercase transition-all duration-300 hover:border-cream-50 hover:bg-cream-50/8"
          >
            {t("cta_conhecer")}
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="#inscricao"
            className="inline-flex items-center justify-center px-10 py-5 bg-gold text-petrol font-display tracking-[0.22em] text-sm uppercase transition-all duration-300 hover:bg-gold-light shadow-[0_0_32px_rgba(176,141,87,0.45)]"
          >
            {t("cta_inscrever")}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-cream-50/35">
        <span className="font-display text-[10px] tracking-[0.3em] uppercase">
          {t("scroll")}
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-cream-50/35 to-transparent" />
      </div>
    </section>
  );
}
