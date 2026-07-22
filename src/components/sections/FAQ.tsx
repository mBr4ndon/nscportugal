"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Minus } from "lucide-react";

export function FAQ() {
  const t = useTranslations("faq");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: { pergunta: string; resposta: React.ReactNode }[] = [
    {
      pergunta: t("q1"),
      resposta: (
        <>
          <strong>{t("a1_bold")}</strong> {t("a1_resto")}
        </>
      ),
    },
    {
      pergunta: t("q2"),
      resposta: (
        <ul className="space-y-2">
          <li><strong>{t("a2_antes_label")}</strong> {t("a2_antes")}</li>
          <li><strong>{t("a2_durante_label")}</strong> {t("a2_durante")}</li>
        </ul>
      ),
    },
    {
      pergunta: t("q3"),
      resposta: (
        <div className="space-y-4">
          <div>
            <p className="font-display text-xs tracking-widest uppercase text-gold mb-2">{t("a3_sapatos_titulo")}</p>
            <ul className="space-y-1 list-disc list-inside">
              {(t.raw("a3_sapatos_items") as string[]).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-xs tracking-widest uppercase text-gold mb-2">{t("a3_dormir_titulo")}</p>
            <ul className="space-y-1 list-disc list-inside">
              {(t.raw("a3_dormir_items") as string[]).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      pergunta: t("q4"),
      resposta: (
        <>
          <p className="mb-3 text-petrol/60 text-sm italic">{t("a4_intro")}</p>
          <ul className="space-y-1 list-disc list-inside">
            {(t.raw("a4_items") as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      pergunta: t("q5"),
      resposta: (
        <>
          <p className="mb-3 text-petrol/60 text-sm italic">{t("a5_intro")}</p>
          <ul className="space-y-1 list-disc list-inside">
            {(t.raw("a5_items") as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      ),
    },
    { pergunta: t("q6"),  resposta: t("a6")  },
    { pergunta: t("q7"),  resposta: t("a7")  },
    { pergunta: t("q9"),  resposta: t("a9")  },
    { pergunta: t("q11"), resposta: t("a11") },
  ];

  return (
    <section id="faq" className="relative py-32 bg-cream-100">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl md:text-6xl text-petrol font-light leading-tight">
              {t("titulo")}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-cream-50 border border-petrol/10 transition-all duration-300 hover:border-petrol/30"
              >
                <button
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full px-6 md:px-8 py-5 flex items-center justify-between gap-6 text-left group"
                  aria-expanded={openIdx === idx}
                >
                  <span className="font-display text-base md:text-lg text-petrol tracking-wide">
                    {faq.pergunta}
                  </span>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full border border-petrol/20 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
                    {openIdx === idx ? (
                      <Minus className="w-4 h-4 text-gold" strokeWidth={1.5} />
                    ) : (
                      <Plus className="w-4 h-4 text-petrol group-hover:text-gold" strokeWidth={1.5} />
                    )}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${
                    openIdx === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="w-12 h-px bg-gold/50 mb-4" />
                    <div className="font-serif text-petrol/75 leading-relaxed text-lg">
                      {faq.resposta}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
