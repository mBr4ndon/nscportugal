import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { Ornament } from "@/components/ui/Ornament";

export default async function SucessoPage() {
  const t = await getTranslations("sucesso");

  return (
    <main className="min-h-screen bg-cream-50 flex items-center justify-center px-6 py-20">
      <div className="max-w-xl text-center">
        <Ornament variant="cross" className="mb-8" />

        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gold/20 flex items-center justify-center">
          <Check className="w-10 h-10 text-gold" strokeWidth={1.5} />
        </div>

        <p className="font-display text-[11px] tracking-[0.4em] uppercase text-gold mb-4">
          {t("pretitulo")}
        </p>
        <h1 className="font-display text-5xl text-petrol font-light mb-6 text-balance">
          {t("titulo")}
        </h1>
        <p className="font-serif text-lg text-petrol/70 mb-10 leading-relaxed">
          {t("texto")}
        </p>

        <div className="border-t border-petrol/10 pt-10 space-y-4">
          <p className="font-serif italic text-petrol/60">
            {t("oracao")}
          </p>
          <Link href="/" className="btn-ghost inline-flex mt-4">
            {t("voltar")}
          </Link>
        </div>
      </div>
    </main>
  );
}
