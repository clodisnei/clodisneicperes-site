import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageAnalytics } from "@/app/components/SiteAnalytics";
import ShareReflection from "@/app/components/ShareReflection";
import { getSiteContent } from "@/lib/site-content";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const reflection = content.reflections.find((item) => item.slug === slug && item.published);
  if (!reflection) return { title: "Reflexão não encontrada" };
  const previewImage = content.authorImageUrl.startsWith("http") ? content.authorImageUrl : `${siteUrl}${content.authorImageUrl}`;

  return {
    title: `${reflection.title} | Clodisnei C. Peres`,
    description: reflection.excerpt || reflection.body.slice(0, 155),
    alternates: { canonical: `${siteUrl}/reflexoes/${reflection.slug}` },
    openGraph: {
      title: reflection.title,
      description: reflection.excerpt || reflection.body.slice(0, 155),
      type: "article",
      url: `${siteUrl}/reflexoes/${reflection.slug}`,
      images: [{ url: previewImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: reflection.title,
      description: reflection.excerpt || reflection.body.slice(0, 155),
      images: [previewImage],
    },
  };
}

export default async function ReflectionPage({ params }: PageProps) {
  const { slug } = await params;
  const content = await getSiteContent();
  const reflection = content.reflections.find((item) => item.slug === slug && item.published && item.title.trim() && item.body.trim());
  if (!reflection) notFound();

  const pageUrl = `${siteUrl}/reflexoes/${reflection.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: reflection.title,
    description: reflection.excerpt,
    datePublished: reflection.publishedAt,
    dateModified: reflection.publishedAt,
    inLanguage: "pt-BR",
    mainEntityOfPage: pageUrl,
    author: { "@type": "Person", name: "Clodisnei Cavalcante Peres", url: siteUrl },
  };

  return (
    <main className="reflection-page">
      <PageAnalytics path={`/reflexoes/${reflection.slug}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="reflection-nav">
        <Link className="brand" href="/" aria-label="Voltar ao site de Clodisnei C. Peres">
          <span className="brand-mark">CP</span>
          <span><strong>Clodisnei C. Peres</strong><small>Autor e criador</small></span>
        </Link>
        <Link href="/reflexoes">← Voltar às reflexões</Link>
      </header>
      <article className="reflection-article">
        <header>
          <p className="eyebrow">Reflexão</p>
          <h1>{reflection.title}</h1>
          {reflection.excerpt && <p className="reflection-excerpt">{reflection.excerpt}</p>}
          <div className="reflection-byline">
            <img src={content.authorImageUrl} alt="" width="900" height="1350" decoding="async" />
            <span><strong>Clodisnei Cavalcante Peres</strong><time dateTime={reflection.publishedAt}>{formatDate(reflection.publishedAt)}</time></span>
          </div>
          <ShareReflection title={reflection.title} url={pageUrl} />
        </header>
        <div className="reflection-body">
          {reflection.body.split(/\n\s*\n/).filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <footer>
          <p>Se esta reflexão conversou com você, conheça também o livro <em>O Que Restou de Mim</em> e o Plano de 30 Dias gratuito.</p>
          <div className="button-row">
            <Link className="button button-dark" href="/#livro">Conhecer o livro</Link>
            <Link className="button button-outline" href="/#plano">Conhecer o plano gratuito</Link>
          </div>
        </footer>
      </article>
    </main>
  );
}

function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}
