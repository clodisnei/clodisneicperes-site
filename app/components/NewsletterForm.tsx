"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending"); setMessage("");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, consent, website, startedAt: startedAt.current }) });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Não foi possível concluir o cadastro.");
      setStatus("success"); setMessage("Cadastro realizado. Obrigado por acompanhar este caminho."); setEmail(""); setConsent(false); startedAt.current = Date.now();
    } catch (error) {
      setStatus("error"); setMessage(error instanceof Error ? error.message : "Não foi possível concluir o cadastro.");
    }
  }

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <label className="honeypot-field" aria-hidden="true">Não preencha<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
      <div><label htmlFor="newsletter-email">Seu e-mail</label><input id="newsletter-email" type="email" required autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
      <button className="button button-cream" type="submit" disabled={status === "sending"}>{status === "sending" ? "Enviando..." : "Quero acompanhar"}</button>
      <label className="newsletter-consent"><input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>Concordo em receber novidades por e-mail. Posso cancelar quando quiser.</span></label>
      <p className={`newsletter-message ${status}`} aria-live="polite">{message}</p>
    </form>
  );
}
