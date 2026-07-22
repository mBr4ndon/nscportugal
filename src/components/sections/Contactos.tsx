import { getTranslations } from "next-intl/server";
import { Mail, Phone } from "lucide-react";

export async function Contactos() {
  const t = await getTranslations("contactos");

  return (
    <section id="contactos" className="relative py-32 bg-cream-50">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl md:text-6xl text-petrol font-light leading-tight">
              {t("titulo")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
            <div className="space-y-8">
              <p className="font-serif text-lg text-petrol/75 leading-relaxed">
                {t("intro")}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-display text-[10px] tracking-[0.3em] uppercase text-petrol/50 mb-1">
                      {t("email_label")}
                    </div>
                    <a
                      href="mailto:infonscportugal@gmail.com"
                      className="font-serif text-lg text-petrol hover:text-gold transition-colors"
                    >
                      infonscportugal@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-display text-[10px] tracking-[0.3em] uppercase text-petrol/50 mb-1">
                      {t("tel_label")}
                    </div>
                    <a
                      href="tel:+351915272683"
                      className="font-serif text-lg text-petrol hover:text-gold transition-colors"
                    >
                      (+351) 915 272 683 | (+351) 912 376 633
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </div>
                  <div>
                    <div className="font-display text-[10px] tracking-[0.3em] uppercase text-petrol/50 mb-1">
                      Instagram
                    </div>
                    <a
                      href="https://www.instagram.com/nscportugal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-serif text-lg text-petrol hover:text-gold transition-colors"
                    >
                      @nscportugal
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-petrol text-cream-50 p-10 md:p-12">
              <div className="absolute top-6 left-6 font-serif text-7xl text-gold leading-none opacity-80">
                &ldquo;
              </div>
              <div className="pt-12">
                <p className="font-serif text-xl md:text-2xl italic leading-relaxed text-pretty mb-8">
                  {t("citacao")}
                </p>
                <div className="w-16 h-px bg-gold mb-4" />
                <cite className="font-display text-xs tracking-[0.3em] uppercase text-gold not-italic">
                  {t("autor_citacao")}
                </cite>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
