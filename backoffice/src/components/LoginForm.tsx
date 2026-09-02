"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await response.json() as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "Não foi possível iniciar sessão.");
        return;
      }
      window.location.assign("/dashboard");
    } catch {
      setError("Não foi possível contactar o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label htmlFor="password">Palavra-passe</label>
      <div className="password-field">
        <LockKeyhole size={18} aria-hidden="true" />
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Introduza a palavra-passe"
          required
          autoFocus
        />
        <button
          type="button"
          className="icon-button"
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button login-button" type="submit" disabled={loading}>
        {loading ? "A entrar…" : "Entrar no backoffice"}
        {!loading && <ArrowRight size={18} aria-hidden="true" />}
      </button>
    </form>
  );
}
