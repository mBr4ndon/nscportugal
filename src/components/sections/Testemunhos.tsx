import { Ornament } from "@/components/ui/Ornament";

const testemunhos = [
  {
    texto:
      /* [COPY: Testemunho 1] */ "Caminhar três dias em oração mudou a minha forma de ver a fé. Não foi um evento, foi um encontro.",
    autor: /* [COPY] */ "Maria J.",
    papel: /* [COPY] */ "Peregrina, Porto",
  },
  {
    texto:
      /* [COPY: Testemunho 2] */ "Redescobri a beleza da liturgia tradicional e o sentido de comunidade que julgava perdido. Voltarei todos os anos.",
    autor: /* [COPY] */ "Francisco M.",
    papel: /* [COPY] */ "Peregrino, Lisboa",
  },
  {
    texto:
      /* [COPY: Testemunho 3] */ "Ver tantos jovens de joelhos diante do Santíssimo foi o sinal de esperança que há muito procurava.",
    autor: /* [COPY] */ "Pe. António S.",
    papel: /* [COPY] */ "Capelão da Peregrinação",
  },
];

export function Testemunhos() {
  return (
    <section id="testemunhos" className="relative py-32 bg-petrol text-cream-50 overflow-hidden">
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background:
            "radial-gradient(ellipse at 80% 50%, rgba(176, 141, 87, 0.3) 0%, transparent 60%)",
        }}
      />

      <div className="relative container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <Ornament variant="fleur" className="text-cream-50/50 mb-6" />
            <p className="font-display text-[11px] tracking-[0.4em] uppercase text-gold mb-4">
              Vozes do Caminho
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-light leading-tight text-balance">
              {/* [COPY: Headline Testemunhos] */}
              Testemunhos de
              <br />
              <span className="italic font-serif text-gold-light">quem caminhou</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {testemunhos.map((t, idx) => (
              <figure
                key={idx}
                className="relative p-8 md:p-10 bg-petrol-700/50 border border-gold/20 hover:border-gold/60 transition-all duration-500"
              >
                {/* Aspa decorativa */}
                <div className="absolute -top-4 left-8 font-serif text-6xl text-gold leading-none">
                  &ldquo;
                </div>

                <blockquote className="font-serif text-lg md:text-xl text-cream-50/90 leading-relaxed mb-8 italic pt-4">
                  {t.texto}
                </blockquote>

                <figcaption className="border-t border-gold/20 pt-6">
                  <div className="font-display text-sm tracking-widest uppercase text-gold">
                    {t.autor}
                  </div>
                  <div className="font-serif text-sm text-cream-50/60 mt-1">
                    {t.papel}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
