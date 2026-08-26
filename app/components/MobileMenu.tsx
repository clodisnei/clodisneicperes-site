"use client";

import { useEffect, useState } from "react";

type Props = { hasVideo: boolean; hasReflections: boolean; hasContact: boolean };

export default function MobileMenu({ hasVideo, hasReflections, hasContact }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="mobile-menu">
      <button className="mobile-menu-button" type="button" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((current) => !current)}>
        <span /><span /><span />
      </button>
      {open && (
        <div className="mobile-menu-panel" id="mobile-navigation">
          <a href="#autor" onClick={close}>Trajetória</a>
          {hasVideo && <a href="#video" onClick={close}>Minha história</a>}
          <a href="#projetos" onClick={close}>Obras e projetos</a>
          <a href="#livro" onClick={close}>O livro</a>
          {hasReflections && <a href="#reflexoes" onClick={close}>Reflexões</a>}
          {hasContact && <a href="#contato" onClick={close}>Contato</a>}
        </div>
      )}
    </div>
  );
}
