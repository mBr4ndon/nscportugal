import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Ornament } from "@/components/ui/Ornament";
import { ArrowRight } from "lucide-react";

export async function Historia() {
  const t = await getTranslations("historia");

  const temas = [
    {
      href: "/nazare",
      pretitulo: t("nazare_pretitulo"),
      titulo: t("nazare_titulo"),
      descricao: t("nazare_descricao"),
    },
    {
      href: "/missa",
      pretitulo: t("missa_pretitulo"),
      titulo: t("missa_titulo"),
      descricao: t("missa_descricao"),
    },
    {
      href: "/fatima",
      pretitulo: t("fatima_pretitulo"),
      titulo: t("fatima_titulo"),
      descricao: t("fatima_descricao"),
    },
  ];

  return (
    <section id="historia" className="relative bg-cream-100 text-petrol overflow-hidden">

      <div className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <p className="font-display text-[10px] tracking-[0.4em] uppercase text-gold-dark text-center mb-12">
              {t("aprofundar_label")}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {temas.map((tema) => (
                <Link
                  key={tema.href}
                  href={tema.href}
                  className="group relative flex flex-col p-8 border border-petrol/15 hover:border-gold/60 bg-white hover:bg-cream-200 transition-all duration-400"
                >
                  <p className="font-display text-[9px] tracking-[0.35em] uppercase text-gold-dark mb-3">
                    {tema.pretitulo}
                  </p>
                  <h3 className="font-display text-2xl text-petrol mb-4 group-hover:text-gold-dark transition-colors duration-300">
                    {tema.titulo}
                  </h3>
                  <p className="font-serif text-petrol/65 leading-relaxed text-base flex-1">
                    {tema.descricao}
                  </p>
                  <div className="flex items-center gap-2 mt-6 font-display text-[10px] tracking-[0.25em] uppercase text-gold-dark">
                    {t("saber_mais")}
                    <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-petrol text-cream-50 py-32">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 20% 30%, rgba(176,141,87,0.2) 0%, transparent 50%)",
          }}
        />
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <Ornament variant="cross" className="text-cream-50/50 mb-6" />
              <p className="font-display text-[11px] tracking-[0.4em] uppercase text-gold mb-4">
                {t("pretitulo")}
              </p>
              <h2 className="font-display text-5xl md:text-6xl font-light leading-tight text-balance">
                {t("titulo")}
                <br />
                <span className="italic font-serif text-gold-light">{t("titulo_italico")}</span>
              </h2>
            </div>

            <div className="space-y-16">
              <div className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-12 items-start">
                <div className="md:text-right">
                  <div className="font-display text-3xl text-gold">1983</div>
                  <div className="font-display text-[10px] tracking-[0.3em] uppercase text-cream-50/50 mt-1">{t("e1983_label")}</div>
                </div>
                <div className="relative md:pl-12 md:border-l md:border-gold/30">
                  <div className="absolute -left-1.5 top-2 w-3 h-3 bg-gold rounded-full hidden md:block" />
                  <h3 className="font-display text-2xl mb-3">{t("e1983_titulo")}</h3>
                  <p className="font-serif text-lg text-cream-50/75 leading-relaxed">{t("e1983_texto")}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-12 items-start">
                <div className="md:text-right">
                  <div className="font-display text-3xl text-gold">2010</div>
                  <div className="font-display text-[10px] tracking-[0.3em] uppercase text-cream-50/50 mt-1">{t("e2010_label")}</div>
                </div>
                <div className="relative md:pl-12 md:border-l md:border-gold/30">
                  <div className="absolute -left-1.5 top-2 w-3 h-3 bg-gold rounded-full hidden md:block" />
                  <h3 className="font-display text-2xl mb-3">{t("e2010_titulo")}</h3>
                  <p className="font-serif text-lg text-cream-50/75 leading-relaxed">{t("e2010_texto")}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-12 items-start">
                <div className="md:text-right">
                  <div className="font-display text-3xl text-gold">2021</div>
                  <div className="font-display text-[10px] tracking-[0.3em] uppercase text-cream-50/50 mt-1">{t("e2021_label")}</div>
                </div>
                <div className="relative md:pl-12 md:border-l md:border-gold/30">
                  <div className="absolute -left-1.5 top-2 w-3 h-3 bg-gold rounded-full hidden md:block" />
                  <h3 className="font-display text-2xl mb-3">{t("e2021_titulo")}</h3>
                  <p className="font-serif text-lg text-cream-50/75 leading-relaxed">{t("e2021_texto")}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-12 items-start">
                <div className="md:text-right">
                  <div className="font-display text-3xl text-gold">2025</div>
                  <div className="font-display text-[10px] tracking-[0.3em] uppercase text-cream-50/50 mt-1">{t("e2025_label")}</div>
                </div>
                <div className="relative md:pl-12 md:border-l md:border-gold/30">
                  <div className="absolute -left-1.5 top-2 w-3 h-3 bg-gold rounded-full hidden md:block" />
                  <h3 className="font-display text-2xl mb-3">{t("e2025_titulo")}</h3>
                  <p className="font-serif text-lg text-cream-50/75 leading-relaxed">{t("e2025_texto")}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-12 items-start">
                <div className="md:text-right">
                  <div className="font-display text-3xl text-gold">2026</div>
                  <div className="font-display text-[10px] tracking-[0.3em] uppercase text-cream-50/50 mt-1">{t("e2026b_label")}</div>
                </div>
                <div className="relative md:pl-12 md:border-l md:border-gold/30">
                  <div className="absolute -left-1.5 top-2 w-3 h-3 bg-gold rounded-full hidden md:block" />
                  <h3 className="font-display text-2xl mb-3">{t("e2026b_titulo")}</h3>
                  <p className="font-serif text-lg text-cream-50/75 leading-relaxed">{t("e2026b_texto")}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-12 items-start">
                <div className="md:text-right">
                  <div className="font-display text-3xl text-gold">2026</div>
                  <div className="font-display text-[10px] tracking-[0.3em] uppercase text-cream-50/50 mt-1">{t("e2026_label")}</div>
                </div>
                <div className="relative md:pl-12 md:border-l md:border-gold/30">
                  <div className="absolute -left-1.5 top-2 w-3 h-3 bg-gold rounded-full hidden md:block" />
                  <h3 className="font-display text-2xl mb-3">{t("e2026_titulo")}</h3>
                  <p className="font-serif text-lg text-cream-50/75 leading-relaxed">{t("e2026_texto")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
