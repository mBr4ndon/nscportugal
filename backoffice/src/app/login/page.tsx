import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/dashboard");

  return (
    <main className="login-page">
      <div className="login-art" aria-hidden="true">
        <div className="login-glow login-glow-one" />
        <div className="login-glow login-glow-two" />
        <div className="login-cross"><span /></div>
        <div className="login-art-copy">
          <p className="eyebrow light">Peregrinação NSC · 2026</p>
          <h1>Cada inscrição conta uma história a caminho.</h1>
          <p>Um só lugar para acompanhar as pessoas, os pagamentos e toda a operação da peregrinação.</p>
        </div>
        <div className="login-route" />
      </div>
      <section className="login-panel">
        <div className="login-form-wrap">
          <div className="brand-mark" aria-hidden="true">NSC</div>
          <p className="eyebrow">Área reservada</p>
          <h2>Bem-vindo ao backoffice</h2>
          <p className="login-intro">Introduza a palavra-passe da organização para consultar os dados das inscrições.</p>
          <LoginForm />
          <p className="login-security">A sessão é privada e termina automaticamente após 12 horas.</p>
        </div>
      </section>
    </main>
  );
}
