import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Backoffice · Peregrinação NSC 2026",
  description: "Painel de gestão e análise das inscrições da Peregrinação Nossa Senhora da Cristandade 2026.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
