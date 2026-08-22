import type { Metadata } from "next";
import Link from "next/link";
import { PageAnalytics } from "@/app/components/SiteAnalytics";
import { getSiteContent } from "@/lib/site-content";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reflexões | Clodisnei C. Peres",
  description: "Textos de Clodisnei C. Peres sobre consciência, perdas, identidade e recomeços.",
  alternates: { canonical: `${siteUrl}/reflexoes` },
};

export default async function ReflectionsPage() {
  const content = await getSiteContent();
  const reflections = content.reflections
    .filter((item) => item.published && item.slug.trim() && item.title.trim() && item.body.trim())
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Reflexões de Clodisnei C. Peres",
    url: `${siteUrl}/reflexoes`,
    inLanguage: "pt-BR",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: reflections.map((reflection, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/reflexoes/${reflection.slug}`,
        name: reflection.title,
      })),
    },
  };

  return (
    <main className="reflection-page reflections-archive" id="conteudo">
      <PageAnalytics path="/reflexoes" />
      <a className="skip-link" href="#lista-reflexoes">Pular para as reflexões</a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="reflection-nav">
        <Link className="brand" href="/" aria-label="Voltar ao site de Clodisnei C. Peres">
          <span className="brand-mark">CP</span>
          <span><strong>Clodisnei C. Peres</strong><small>Autor e criador</small></span>
        </Link>
        <Link href="/">← Voltar ao início</Link>
      </header>
      <section className="archive-hero">
        <p className="eyebrow">Reflexões para continuar o caminho</p>
        <h1>Consciência, perdas e recomeços</h1>
        <p>Textos para aprofundar ideias do livro, observar a própria história e acompanhar os caminhos que estão sendo construídos.</p>
      </section>
      <section className="archive-list" id="lista-reflexoes" aria-label="Todas as reflexões publicadas">
        {reflections.length > 0 ? (
          <div className="reflection-grid">
            {reflections.map((reflection) => (
              <article className="reflection-card" key={reflection.id}>
                <time dateTime={reflection.publishedAt}>{formatDate(reflection.publishedAt)}</time>
                <h2>{reflection.title}</h2>
                <p>{reflection.excerpt || reflection.body.slice(0, 180)}</p>
                <Link href={`/reflexoes/${reflection.slug}`}>Ler reflexão <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="archive-empty">
            <p className="eyebrow">Em preparação</p>
            <h2>As primeiras reflexões serão publicadas aqui.</h2>
            <p>Enquanto isso, você pode conhecer o livro e acessar gratuitamente o Plano de 30 Dias.</p>
            <div className="button-row">
              <Link className="button button-dark" href="/#livro">Conhecer o livro</Link>
              <Link className="button button-outline" href="/#plano">Acessar o plano</Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}
