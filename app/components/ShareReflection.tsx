"use client";

import { useState } from "react";
import { TrackedLink } from "./SiteAnalytics";

export default function ShareReflection({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} — Clodisnei C. Peres`);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="share-reflection" aria-label="Compartilhar esta reflexão">
      <span>Compartilhar</span>
      <TrackedLink eventName="social_click" href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`} target="_blank" rel="noreferrer">WhatsApp</TrackedLink>
      <TrackedLink eventName="social_click" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer">Facebook</TrackedLink>
      <TrackedLink eventName="social_click" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer">LinkedIn</TrackedLink>
      <button type="button" onClick={copyLink}>{copied ? "Link copiado" : "Copiar link"}</button>
    </div>
  );
}
