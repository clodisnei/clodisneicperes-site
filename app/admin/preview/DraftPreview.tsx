"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/site-content";

export default function DraftPreview({ fallback }: { fallback: SiteContent }) {
  const [content, setContent] = useState(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const draft = localStorage.getItem("clodisnei-site-draft-preview");
        if (draft) setContent(JSON.parse(draft) as SiteContent);
      } catch {
        setContent(fallback);
      } finally {
        setLoaded(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fallback]);

  const bookLinks = content.bookLinks.filter((item) => item.published && item.label && item.url);
  const testimonials = content.testimonials.filter((item) => item.published && item.name && item.text);
  const reflections = content.reflections.filter((item) => item.published && item.title);
  const socialLinks = content.socialLinks.filter((item) => item.published && item.label && item.url);

  return (
    <main className="draft-preview">
      <div className="preview-banner">
        <div><strong>Pré-visualização privada</strong><span>{loaded ? "Estas alterações ainda não foram publicadas." : "Carregando alterações..."}</span></div>
        <button type="button" onClick={() => window.close()}>Fechar</button>
      </div>
      <section className="preview-hero">
        <div><p className="eyebrow">{content.presentationEyebrow}</p><h1>{content.presentationTitle}</h1><p>{content.presentationIntro}</p></div>
        <img src={content.authorImageUrl} alt="Foto principal do autor" />
      </section>
      <section className="preview-author">
        <img src={content.secondaryImageUrl || content.authorImageUrl} alt="Segunda foto do autor" />
        <div><p className="eyebrow">Trajetória</p><h2>{content.authorTitle}</h2>{content.authorBiography.slice(0, 3).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>
      <section className="preview-dark">
        <p className="eyebrow light">O livro</p><h2>{content.bookTitle}</h2><p>{content.bookSummary}</p>
        <div className="preview-links">{bookLinks.map((item) => <span key={item.id}><strong>{item.label}</strong><small>{item.detail}</small></span>)}</div>
      </section>
      <section className="preview-journey">
        <img src={content.journeyCoverUrl} alt="Capa da Jornada" />
        <div><p className="eyebrow">{content.journeyStatus}</p><h2>{content.journeyTitle}</h2><p>{content.journeyDescription}</p></div>
      </section>
      {testimonials.length > 0 && <section className="preview-list"><p className="eyebrow">Depoimentos publicados</p>{testimonials.map((item) => <blockquote key={item.id}>“{item.text}” <strong>— {item.name}</strong></blockquote>)}</section>}
      {reflections.length > 0 && <section className="preview-list"><p className="eyebrow">Reflexões publicadas</p>{reflections.map((item) => <article key={item.id}><h3>{item.title}</h3><p>{item.excerpt}</p></article>)}</section>}
      {(content.contactEmail || content.pressKitUrl || socialLinks.length > 0) && <section className="preview-contact"><h2>{content.contactTitle}</h2><p>{content.contactDescription}</p><div className="preview-links">{content.contactEmail && <span>{content.contactEmail}</span>}{socialLinks.map((item) => <span key={item.id}>{item.label}</span>)}</div></section>}
    </main>
  );
}
