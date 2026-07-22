"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("header");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const p = (anchor: string) => isHome ? anchor : `/${anchor}`;

  const navLinks = [
    { href: p("#sobre"), label: t("nav_sobre") },
    { href: p("#percurso"), label: t("nav_percurso") },
    { href: p("#testemunhos"), label: t("nav_capitulos") },
    { href: "/nazare", label: t("nav_nazare") },
    { href: "/fatima", label: t("nav_fatima") },
    { href: p("#faq"), label: t("nav_faq") },
    { href: p("#contactos"), label: t("nav_contactos") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-petrol border-b border-white/10 transition-shadow duration-300",
        scrolled && "shadow-lg shadow-black/30"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo + identidade */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-[72px] h-[72px] flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt={t("logo_alt")}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="hidden sm:flex sm:flex-col sm:justify-center sm:h-[72px]">
            <div className="font-display text-[14px] tracking-[0.14em] text-cream-50 uppercase leading-snug">
              {t("title_1")}
            </div>
            <div className="font-display text-[14px] tracking-[0.14em] text-cream-50 uppercase leading-snug">
              {t("title_2")}
            </div>
            <div className="font-serif text-[12px] tracking-[0.22em] text-gold uppercase mt-0.5">
              {t("subtitle")}
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-[11px] tracking-[0.16em] uppercase text-cream-50/65 hover:text-cream-50 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <LocaleSwitcher />
          <Link
            href={p("#inscricao")}
            className="font-display text-[11px] tracking-[0.16em] uppercase px-5 py-2.5 bg-gold text-petrol hover:bg-gold-light transition-colors duration-200"
          >
            {t("nav_inscrever")}
          </Link>
        </nav>

        {/* Mobile button */}
        <button
          className="lg:hidden text-cream-50 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-petrol border-t border-white/10">
          <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-sm tracking-widest uppercase text-cream-50/65 hover:text-cream-50 py-2 border-b border-white/8"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <LocaleSwitcher />
            </div>
            <Link
              href={p("#inscricao")}
              onClick={() => setMobileOpen(false)}
              className="font-display text-sm tracking-widest uppercase px-5 py-3 bg-gold text-petrol text-center mt-2"
            >
              {t("nav_inscrever")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
