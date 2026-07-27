import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { Ornament } from "@/components/ui/Ornament";
import { getStripe } from "@/lib/stripe";
import { confirmarPagamento, obterResumoPagamento } from "@/lib/storage";
import { ClearRegistrationDraft } from "@/components/ClearRegistrationDraft";

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SucessoPage({ searchParams }: Props) {
  const t = await getTranslations("sucesso");
  const { session_id: sessionId } = await searchParams;
  let confirmado = false;
  let orderId: string | undefined;
  let ticketUrl: string | undefined;

  if (sessionId?.startsWith("cs_")) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        await confirmarPagamento(
          session.id,
          session.amount_total ?? undefined,
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
          session,
        );
      }
      const resumo = await obterResumoPagamento(session.id);
      confirmado = resumo?.estadoPagamento === "paid" && resumo.estadoInscricao === "confirmed";
      orderId = resumo?.orderId;
      if (confirmado && resumo) ticketUrl = `/api/bilhete/${resumo.ticketToken}`;
    } catch (error) {
      console.error("[sucesso] Não foi possível validar a sessão Stripe:", error);
    }
  }

  return (
    <main className="min-h-screen bg-cream-50 flex items-center justify-center px-6 py-20">
      {confirmado && <ClearRegistrationDraft />}
      <div className="max-w-xl text-center">
        <Ornament variant="cross" className="mb-8" />

        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gold/20 flex items-center justify-center">
          <Check className="w-10 h-10 text-gold" strokeWidth={1.5} />
        </div>

        <p className="font-display text-[11px] tracking-[0.4em] uppercase text-gold mb-4">
          {t("pretitulo")}
        </p>
        <h1 className="font-display text-5xl text-petrol font-light mb-6 text-balance">
          {confirmado ? t("titulo") : t("titulo_pendente")}
        </h1>
        <p className="font-serif text-lg text-petrol/70 mb-10 leading-relaxed">
          {confirmado ? t("texto") : t("texto_pendente")}
        </p>
        {orderId && <p className="font-display text-xs tracking-widest text-petrol/50 mb-8">
          {t("referencia")}: {orderId}
        </p>}
        {ticketUrl && <a href={ticketUrl} className="btn-primary inline-flex mb-10">
          {t("descarregar_bilhete")}
        </a>}

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
