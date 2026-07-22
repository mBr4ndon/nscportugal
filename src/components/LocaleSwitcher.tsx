"use client";

import { useParams } from "next/navigation";
import { useTransition, useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ChevronDown } from "lucide-react";

const LOCALES: { code: string; label: string; flag: string }[] = [
  { code: "pt", label: "PT", flag: "🇵🇹" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "it", label: "IT", flag: "🇮🇹" },
];

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLocale = (params.locale as string) ?? routing.defaultLocale;
  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  function switchLocale(locale: string) {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className="flex items-center gap-1.5 px-2.5 py-1.5 border border-white/15 hover:border-white/35 transition-colors duration-200 group"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="font-display text-[10px] tracking-[0.15em] uppercase text-cream-50/75 group-hover:text-cream-50 transition-colors duration-200">
          {current.label}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-cream-50/45 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-28 bg-petrol border border-white/15 shadow-xl shadow-black/40 z-50"
          role="listbox"
        >
          {LOCALES.map((locale) => {
            const isActive = locale.code === currentLocale;
            return (
              <button
                key={locale.code}
                onClick={() => switchLocale(locale.code)}
                role="option"
                aria-selected={isActive}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors duration-150 ${
                  isActive
                    ? "bg-gold/15 text-gold"
                    : "text-cream-50/65 hover:bg-white/8 hover:text-cream-50"
                }`}
              >
                <span className="text-base leading-none">{locale.flag}</span>
                <span className="font-display text-[10px] tracking-[0.2em] uppercase">
                  {locale.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
