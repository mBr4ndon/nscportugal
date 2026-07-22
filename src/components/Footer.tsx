import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="relative bg-petrol-900 text-cream-50 py-16 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Image
              src="/images/logo.png"
              alt={t("logo_alt")}
              width={64}
              height={72}
              className="mb-6 object-contain"
            />
            <h3 className="font-display text-lg tracking-wider uppercase mb-2">
              {t("titulo")}
            </h3>
            <p className="font-serif text-cream-50/60 leading-relaxed max-w-md">
              {t("descricao")}
            </p>
          </div>

          <div>
            <div className="font-display text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
              {t("nav_titulo")}
            </div>
            <ul className="space-y-2 font-serif text-cream-50/70">
              <li><Link href="/#sobre" className="hover:text-gold transition-colors">{t("nav_sobre")}</Link></li>
              <li><Link href="/#historia" className="hover:text-gold transition-colors">{t("nav_historia")}</Link></li>
              <li><Link href="/#percurso" className="hover:text-gold transition-colors">{t("nav_percurso")}</Link></li>
              <li><Link href="/#programa" className="hover:text-gold transition-colors">{t("nav_rota")}</Link></li>
              <li><Link href="/#inscricao" className="hover:text-gold transition-colors">{t("nav_inscricao")}</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-display text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
              {t("legal_titulo")}
            </div>
            <ul className="space-y-2 font-serif text-cream-50/70">
              <li><Link href="/politica-privacidade" className="hover:text-gold transition-colors">{t("legal_privacidade")}</Link></li>
              <li><Link href="/termos" className="hover:text-gold transition-colors">{t("legal_termos")}</Link></li>
              <li><Link href="/regulamento" className="hover:text-gold transition-colors">{t("legal_regulamento")}</Link></li>
              <li><Link href="/reembolsos" className="hover:text-gold transition-colors">{t("legal_reembolsos")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream-50/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-serif text-xs text-cream-50/50">
            {t("direitos", { ano: new Date().getFullYear() })}
          </div>
          <div className="font-serif italic text-xs text-gold">
            {t("latim")}
          </div>
        </div>
      </div>
    </footer>
  );
}
