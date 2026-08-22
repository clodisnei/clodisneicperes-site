"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

export default function JourneyWaitlistForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, consent, website, startedAt: startedAt.current }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Não foi possível concluir o cadastro.");
      setStatus("success");
      setMessage("Cadastro realizado. Você receberá notícias quando a Jornada estiver pronta.");
      setEmail("");
      setConsent(false);
      startedAt.current = Date.now();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível concluir o cadastro.");
    }
  }

  return (
    <form className="waitlist-form" onSubmit={submit}>
      <label className="honeypot-field" aria-hidden="true">Não preencha este campo<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
      <label htmlFor="journey-email">Quero acompanhar a construção</label>
      <div className="waitlist-row">
        <input id="journey-email" type="email" required autoComplete="email" placeholder="Seu melhor e-mail" value={email} onChange={(event) => setEmail(event.target.value)} />
        <button className="button button-dark" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Enviando..." : "Avise-me"}
        </button>
      </div>
      <label className="waitlist-consent">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
        <span>Concordo em receber por e-mail novidades sobre a Jornada. Posso cancelar a qualquer momento.</span>
      </label>
      <p className={`waitlist-message ${status}`} aria-live="polite">{message}</p>
    </form>
  );
}
