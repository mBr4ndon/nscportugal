"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const WAYPOINT_COORDS = [
  { x: 75,  y: 215, label: "Nazaré",      above: false },
  { x: 248, y: 335, label: "Alcobaça",    above: false },
  { x: 365, y: 308, label: "Aljubarrota", above: true  },
  { x: 602, y: 258, label: "Porto de Mós", above: false },
  { x: 578, y: 88,  label: "Batalha",     above: true  },
  { x: 918, y: 168, label: "Fátima",      above: false },
];

const ROUTE = "M 75,215 C 105,228 138,258 165,278 C 198,302 225,323 248,335 C 295,322 330,314 365,308 C 420,298 490,278 548,267 C 570,263 588,260 602,258 C 600,212 592,162 585,115 C 582,100 579,93 578,88 C 645,112 728,140 808,156 C 855,163 887,166 918,168";

const POINT_DELAYS = [0.2, 1.0, 1.5, 2.2, 2.7, 3.4];
const ANIM_DURATION = 3.8;

export function Programa() {
  const t = useTranslations("rota");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  const waypoints = WAYPOINT_COORDS.map((wp, i) => ({
    ...wp,
    detail: t(`wp${i}_detail` as Parameters<typeof t>[0]),
    dia: t(`wp${i}_dia` as Parameters<typeof t>[0]),
  }));

  const legenda = [
    { dia: t("leg1_dia"), rota: t("leg1_rota"), km: t("leg1_km") },
    { dia: t("leg2_dia"), rota: t("leg2_rota"), km: t("leg2_km") },
    { dia: t("leg3_dia"), rota: t("leg3_rota"), km: t("leg3_km") },
  ];

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setPlaying(true); },
      { threshold: 0.25 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="programa" ref={sectionRef} className="relative py-24 bg-petrol overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse at 80% 30%, rgba(176,141,87,0.25) 0%, transparent 55%)" }}
      />

      <div className="relative container mx-auto px-6">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="font-display text-5xl md:text-6xl text-cream-50 font-light leading-tight mb-5">
              {t("titulo")}
            </h2>
          </div>

          <div className="relative w-full border border-cream-50/10 bg-petrol-700/40 overflow-hidden">
            <svg
              viewBox="0 0 1000 420"
              preserveAspectRatio="xMidYMid meet"
              className="w-full"
              aria-label={t("mapa_alt")}
            >
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
                </pattern>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <rect width="1000" height="420" fill="url(#grid)" />

              {[
                "M 0,180 C 150,170 280,200 400,195 C 520,190 650,175 800,185 C 880,190 940,195 1000,192",
                "M 0,250 C 100,260 250,280 380,265 C 500,252 620,248 750,255 C 850,260 930,265 1000,262",
                "M 300,420 C 350,390 380,360 400,330 C 420,300 440,280 460,270",
                "M 450,0 C 460,30 470,55 478,80 C 486,105 490,130 490,155",
              ].map((d, i) => (
                <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              ))}

              <path d={ROUTE} fill="none" stroke="rgba(176,141,87,0.15)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />

              <path
                d={ROUTE}
                fill="none"
                stroke="#FAF7F2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2400"
                strokeDashoffset={playing ? "0" : "2400"}
                style={{ transition: playing ? `stroke-dashoffset ${ANIM_DURATION}s cubic-bezier(0.4,0,0.2,1)` : "none" }}
              />

              <path
                d={ROUTE}
                fill="none"
                stroke="#B08D57"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 12"
                opacity={playing ? "0.5" : "0"}
                style={{ transition: playing ? `opacity 0.5s ease ${ANIM_DURATION * 0.5}s` : "none" }}
              />

              {waypoints.map((wp, i) => {
                const delay = POINT_DELAYS[i];
                const isFirst = i === 0;
                const isLast  = i === waypoints.length - 1;
                return (
                  <g key={i}>
                    <circle cx={wp.x} cy={wp.y} r="12" fill="rgba(176,141,87,0.12)" opacity={playing ? "1" : "0"} style={{ transition: playing ? `opacity 0.4s ease ${delay}s` : "none" }} />
                    <circle cx={wp.x} cy={wp.y} r={isFirst || isLast ? 7 : 5} fill={isFirst || isLast ? "#B08D57" : "#2C3E50"} stroke="#B08D57" strokeWidth={isFirst || isLast ? "0" : "1.5"} opacity={playing ? "1" : "0"} style={{ transition: playing ? `opacity 0.3s ease ${delay}s` : "none" }} />
                    {!(isFirst || isLast) && (
                      <circle cx={wp.x} cy={wp.y} r="2" fill="#B08D57" opacity={playing ? "1" : "0"} style={{ transition: playing ? `opacity 0.3s ease ${delay + 0.1}s` : "none" }} />
                    )}
                    <g opacity={playing ? "1" : "0"} style={{ transition: playing ? `opacity 0.4s ease ${delay + 0.15}s` : "none" }}>
                      <text x={wp.x} y={wp.above ? wp.y - 22 : wp.y + 22} textAnchor="middle" fontSize="11" fontFamily="Cinzel, serif" fontWeight="500" letterSpacing="1.5" fill="#FAF7F2">
                        {wp.label.toUpperCase()}
                      </text>
                      <text x={wp.x} y={wp.above ? wp.y - 10 : wp.y + 34} textAnchor="middle" fontSize="8.5" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fill="#B08D57" letterSpacing="0.5">
                        {wp.detail}
                      </text>
                    </g>
                  </g>
                );
              })}

              <path d="M 55,0 C 57,60 53,120 60,180 C 65,220 63,260 57,300 C 53,330 55,370 57,420" fill="none" stroke="rgba(100,160,220,0.15)" strokeWidth="8" />
              <text x="48" y="295" fontSize="7" fontFamily="Cinzel, serif" fill="rgba(100,160,220,0.3)" textAnchor="middle" letterSpacing="2">
                ATLÂNTICO
              </text>
            </svg>
          </div>

          <div className="mt-8 grid grid-cols-3 divide-x divide-cream-50/10 border border-cream-50/10">
            {legenda.map((d, i) => (
              <div key={i} className="px-6 py-5 text-center group hover:bg-cream-50/5 transition-colors duration-200">
                <div className="font-display text-[10px] tracking-[0.3em] uppercase text-gold mb-1">{d.dia}</div>
                <div className="font-serif text-cream-50/80 text-sm mb-1">{d.rota}</div>
                <div className="font-display text-[10px] tracking-[0.2em] uppercase text-cream-50/35">{d.km}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
