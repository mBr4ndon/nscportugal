import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function Sobre() {
  const t = await getTranslations("sobre");

  return (
    <section id="sobre" className="relative bg-cream-100">

      <div className="bg-petrol py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-display text-[10px] tracking-[0.4em] uppercase text-gold mb-5">
              {t("quem_somos_label")}
            </p>
            <p className="font-serif text-xl md:text-2xl text-cream-50/85 leading-relaxed text-pretty">
              {t("intro")}
            </p>
          </div>
        </div>
      </div>

      <div className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">

            <div className="text-center mb-20">
              <h2 className="font-display text-5xl md:text-6xl text-petrol font-light leading-tight">
                {t("titulo")}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-start">

              <div>
                <p className="font-display text-[10px] tracking-[0.35em] uppercase text-gold mb-6">
                  {t("missao_label")}
                </p>
                <p className="versal font-serif text-lg text-petrol/80 leading-relaxed mb-7">
                  {t("missao_p1")}
                </p>
                <p className="font-serif text-lg text-petrol/80 leading-relaxed">
                  {t.rich("missao_p2", {
                    it: (chunks) => <span className="italic">{chunks}</span>,
                  })}
                </p>
              </div>

              <div className="flex items-center justify-center md:pt-8">
                <div className="relative w-full max-w-[320px] aspect-[3/4]">
                  <Image
                    src="/images/logo_azul.png"
                    alt="Nossa Senhora da Cristandade"
                    fill
                    className="object-contain object-top"
                    sizes="(max-width: 768px) 80vw, 320px"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
