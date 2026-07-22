import { getTranslations } from "next-intl/server";
import { Users, UserCheck, Cross, Mail } from "lucide-react";

export async function Capitulos() {
  const t = await getTranslations("capitulos");

  const passos = [
    { n: "I",   icon: Users,      titulo: t("p1_titulo"), descricao: <>{t("p1_descricao")}</> },
    { n: "II",  icon: UserCheck,  titulo: t("p2_titulo"), descricao: <>{t("p2_descricao")}</> },
    { n: "III", icon: Cross,      titulo: t("p3_titulo"), descricao: <>{t("p3_descricao")}</> },
    {
      n: "IV",
      icon: Mail,
      titulo: t("p4_titulo"),
      descricao: (
        <>
          {t("p4_pre")}{" "}
          <a
            href="mailto:infonscportugal@gmail.com"
            className="text-gold underline underline-offset-4 decoration-gold/40 hover:decoration-gold transition-all duration-200"
          >
            infonscportugal@gmail.com
          </a>{" "}
          {t("p4_pos")}
        </>
      ),
    },
  ];

  return (
    <section id="testemunhos" className="relative py-32 bg-petrol text-cream-50 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{ background: "radial-gradient(ellipse at 20% 60%, rgba(176,141,87,0.3) 0%, transparent 55%)" }}
      />

      <div className="relative container mx-auto px-6">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="font-display text-5xl md:text-6xl font-light leading-tight mb-10">
              {t("titulo")}
            </h2>

            <p className="font-serif text-xl text-cream-50/75 max-w-3xl mx-auto leading-relaxed text-pretty">
              {t.rich("intro", {
                q: (chunks) => <span className="italic text-cream-50">{chunks}</span>,
              })}
            </p>
          </div>

          <div className="flex items-center gap-6 mb-16">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30" />
            <span className="font-display text-[10px] tracking-[0.4em] uppercase text-gold">
              {t("divisor")}
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30" />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {passos.map((passo, idx) => {
              const Icon = passo.icon;
              return (
                <div
                  key={idx}
                  className="relative flex gap-6 p-8 border border-cream-50/10 bg-cream-50/[0.03] hover:bg-cream-50/[0.06] hover:border-gold/30 transition-all duration-400 group"
                >
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <span className="font-display text-2xl text-gold leading-none">{passo.n}</span>
                    <div className="w-px flex-1 bg-gold/20" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors duration-300">
                        <Icon className="w-4 h-4 text-gold" strokeWidth={1.3} />
                      </div>
                      <h3 className="font-display text-sm tracking-[0.12em] uppercase text-cream-50">
                        {passo.titulo}
                      </h3>
                    </div>
                    <p className="font-serif text-cream-50/70 leading-relaxed text-base pl-11">
                      {passo.descricao}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-l-2 border-gold/40 pl-6 py-1 max-w-2xl mx-auto">
            <p className="font-serif italic text-cream-50/55 text-base leading-relaxed">
              {t("rodape")}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
