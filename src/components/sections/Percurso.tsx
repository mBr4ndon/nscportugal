import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function Percurso() {
  const t = await getTranslations("percurso");

  const dias = [
    {
      numero: t("dia1_numero"),
      rota: t("dia1_rota"),
      km: t("dia1_km"),
      paragens: [
        { evento: t("dia1_p1_evento"), local: t("dia1_p1_local"), img: "/images/percurso_1a.png" },
        { evento: t("dia1_p2_evento"), local: t("dia1_p2_local"), img: "/images/percurso_1b.png" },
        { evento: t("dia1_p3_evento"), local: t("dia1_p3_local"), img: "/images/percurso_1c.png" },
      ],
    },
    {
      numero: t("dia2_numero"),
      rota: t("dia2_rota"),
      km: t("dia2_km"),
      paragens: [
        { evento: t("dia2_p1_evento"), local: t("dia2_p1_local"), img: "/images/percurso_2a.png" },
        { evento: t("dia2_p2_evento"), local: t("dia2_p2_local"), img: "/images/percurso_2b.png" },
        { evento: t("dia2_p3_evento"), local: t("dia2_p3_local"), img: "/images/percurso_2c.png" },
      ],
    },
    {
      numero: t("dia3_numero"),
      rota: t("dia3_rota"),
      km: t("dia3_km"),
      paragens: [
        { evento: t("dia3_p1_evento"), local: t("dia3_p1_local"), img: "/images/percurso_3a.png" },
        { evento: t("dia3_p2_evento"), local: t("dia3_p2_local"), img: "/images/percurso_3b.png" },
        { evento: t("dia3_p3_evento"), local: t("dia3_p3_local"), img: "/images/percurso_3c.png" },
      ],
    },
  ];

  return (
    <section id="percurso" className="relative py-32 bg-cream-100">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-20">
            <h2 className="font-display text-5xl md:text-6xl text-petrol font-light leading-tight mb-8">
              {t("titulo")}
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-gold to-gold/60" />
              <div className="w-2 h-2 rounded-full bg-gold/80" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent via-gold to-gold/60" />
            </div>
          </div>

          <div className="space-y-16">
            {dias.map((dia, dIdx) => (
              <div key={dIdx}>
                {/* Day header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-[10px] tracking-[0.35em] uppercase text-gold">
                      {dia.numero}
                    </span>
                    <span className="w-px h-3 bg-petrol/25" />
                    <span className="font-display text-[11px] tracking-[0.18em] text-petrol/70 uppercase">
                      {dia.rota}
                    </span>
                  </div>
                  <span className="font-display text-[10px] tracking-[0.3em] uppercase text-petrol/60">
                    {dia.km}
                  </span>
                </div>
                <div className="w-full h-px bg-petrol/10 mb-5" />

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                  {dia.paragens.map((p, pIdx) => (
                    <div key={pIdx} className="relative aspect-[3/4] overflow-hidden group">
                      <Image
                        src={p.img}
                        alt={p.local}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-petrol via-petrol/30 to-transparent" style={{ backgroundImage: "linear-gradient(to top, rgba(44,62,80,1) 0%, rgba(44,62,80,0.75) 35%, rgba(44,62,80,0.2) 60%, transparent 80%)" }} />
                      {/* Text */}
                      <div className="absolute bottom-0 inset-x-0 p-6 text-center">
                        <p className="font-display text-[9px] tracking-[0.35em] uppercase text-gold mb-2" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
                          {p.evento}
                        </p>
                        <p className="font-serif text-cream-50 text-base leading-snug" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                          {p.local}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>
    </section>
  );
}
