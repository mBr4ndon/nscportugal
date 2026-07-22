import { getTranslations } from "next-intl/server";
import { GaleriaGrid } from "@/components/GaleriaLightbox";

const photos: { src: string; alt: string }[] = [
  { src: "/images/galeria_1.jpg",  alt: "Peregrinos na partida da Nazaré" },
  { src: "/images/galeria_2.jpg",  alt: "Bênção de envio no Santuário da Nazaré" },
  { src: "/images/galeria_3.jpg",  alt: "Santa Missa na peregrinação" },
  { src: "/images/galeria_4.jpg",  alt: "Caminho entre Nazaré e Alcobaça" },
  { src: "/images/galeria_5.jpg",  alt: "Mosteiro de Alcobaça" },
  { src: "/images/galeria_6.jpg",  alt: "Almoço em Alcobaça" },
  { src: "/images/galeria_7.jpg",  alt: "Caminho para Aljubarrota" },
  { src: "/images/galeria_8.jpg",  alt: "Peregrinos em oração durante a marcha" },
  { src: "/images/galeria_9.jpg",  alt: "Canto gregoriano durante a caminhada" },
  { src: "/images/galeria_10.jpg", alt: "Passagem por Porto de Mós" },
  { src: "/images/galeria_11.jpg", alt: "Mosteiro da Batalha" },
  { src: "/images/galeria_12.jpg", alt: "Dormida em Batalha" },
  { src: "/images/galeria_13.jpg", alt: "Rosário ao amanhecer" },
  { src: "/images/galeria_14.jpg", alt: "Caminho para as Grutas da Moeda" },
  { src: "/images/galeria_15.jpg", alt: "Procissão de chegada a Fátima" },
  { src: "/images/galeria_16.jpg", alt: "Chegada ao Santuário de Fátima" },
  { src: "/images/galeria_17.jpg", alt: "Vigília na Cova da Iria" },
  { src: "/images/galeria_18.jpg", alt: "Missa de Fecho em Fátima" },
];

export async function Galeria() {
  const t = await getTranslations("galeria");

  return (
    <section id="galeria" className="relative py-24 bg-petrol overflow-hidden">
      <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none" />

      <div className="relative container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="font-display text-5xl md:text-6xl text-cream-50 font-light leading-tight">
            {t("titulo")}
          </h2>
        </div>

        {/* 6 × 3 geometric grid — all cells identical squares */}
        <GaleriaGrid photos={photos} />

        {/* Caption */}
        <p className="text-center font-serif italic text-cream-50/30 text-sm mt-6">
          {t("legenda")}
        </p>

      </div>
    </section>
  );
}
