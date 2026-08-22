import { getSiteContent } from "@/lib/site-content";
import { siteUrl } from "@/lib/site-url";
import Link from "next/link";
import JourneyWaitlistForm from "@/app/components/JourneyWaitlistForm";
import NewsletterForm from "@/app/components/NewsletterForm";
import MobileMenu from "@/app/components/MobileMenu";
import { PageAnalytics, TrackedLink } from "@/app/components/SiteAnalytics";

export const dynamic = "force-dynamic";

const pathway = [
  {
    number: "01",
    eyebrow: "Reconhecer",
    title: "Uma história real",
    text: "O livro acolhe quem teve a vida interrompida por perdas, limitações ou mudanças que alteraram a forma de enxergar a si mesmo.",
  },
  {
    number: "02",
    eyebrow: "Começar",
    title: "Um plano gratuito",
    text: "O Plano de 30 Dias transforma a leitura em perguntas, pequenas ações e reflexões que podem ser feitas no próprio ritmo.",
  },
  {
    number: "03",
    eyebrow: "Aprofundar",
    title: "Uma jornada em construção",
    text: "A Jornada amplia o caminho de autoconsciência e integração, com responsabilidade e sem antecipar um projeto que ainda está sendo desenvolvido.",
  },
];

export default async function Home() {
  const content = await getSiteContent();
  const publishedBookLinks = content.bookLinks.filter((item) => item.published && item.label.trim() && item.url.trim());
  const publishedSocialLinks = content.socialLinks.filter((item) => item.published && item.label.trim() && item.url.trim());
  const publishedFaqs = content.faqs.filter((item) => item.published && item.question.trim() && item.answer.trim());
  const hasContact = Boolean(content.contactEmail || content.pressKitUrl || publishedSocialLinks.length);
  const hasVideo = content.videoPublished && Boolean(content.videoUrl);
  const publishedTestimonials = content.testimonials.filter((item) => item.published && item.name.trim() && item.text.trim());
  const publishedReflections = content.reflections
    .filter((item) => item.published && item.slug.trim() && item.title.trim() && item.body.trim())
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const absoluteImage = (value: string) => value.startsWith("http") ? value : `${siteUrl}${value}`;
  const structuredData: Array<Record<string, unknown>> = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Clodisnei Cavalcante Peres",
      alternateName: "Clodisnei C. Peres",
      url: siteUrl,
      image: absoluteImage(content.authorImageUrl),
      sameAs: publishedSocialLinks.map((item) => item.url),
      birthPlace: { "@type": "Place", name: "Paranavaí, Paraná, Brasil" },
      jobTitle: "Autor",
      knowsAbout: ["Hipnose clínica", "Programação Neurolinguística", "Neurociência", "Autoconhecimento", "Desenvolvimento pessoal"],
    },
    {
      "@context": "https://schema.org",
      "@type": "Book",
      name: "O Que Restou de Mim",
      alternateName: "O Que Restou de Mim: Como a Hipnose, a PNL e a Neurociência me ajudaram a recomeçar depois das perdas",
      isbn: "978-65-02-29243-3",
      bookFormat: "https://schema.org/Paperback",
      inLanguage: "pt-BR",
      image: absoluteImage(content.coverImageUrl),
      author: { "@type": "Person", name: "Clodisnei Cavalcante Peres" },
      description: content.bookSummary,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: publishedFaqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];
  if (hasVideo) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: content.videoTitle,
      description: content.videoIntro,
      thumbnailUrl: absoluteImage(content.videoPosterUrl || content.authorImageUrl),
      contentUrl: absoluteImage(content.videoUrl),
      transcript: content.videoTranscript,
    });
  }

  return (
    <main className="site-shell" id="inicio">
      <PageAnalytics path="/" />
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="site-header">
        <nav className="nav-wrap" aria-label="Navegação principal">
          <a className="brand" href="#inicio" aria-label="Voltar ao início">
            <span className="brand-mark">CP</span>
            <span>
              <strong>Clodisnei C. Peres</strong>
              <small>Autor e criador</small>
            </span>
          </a>
          <div className="nav-links">
            <a href="#autor">O autor</a>
            {hasVideo && <a href="#video">Minha história</a>}
            <a href="#livro">O livro</a>
            <a href="#plano">Plano gratuito</a>
            {publishedReflections.length > 0 && <a href="#reflexoes">Reflexões</a>}
            <a href="#jornada">A Jornada</a>
            {hasContact && <a href="#contato">Contato</a>}
          </div>
          <a className="button button-small button-dark nav-primary-action" href="#livro">
            Conhecer o livro
          </a>
          <MobileMenu hasVideo={hasVideo} hasReflections={publishedReflections.length > 0} hasContact={hasContact} />
        </nav>
      </header>

      <section className="hero section-pad" id="conteudo">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="content-grid hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{content.heroEyebrow}</p>
            <h1>{content.heroTitle}</h1>
            <p className="hero-lead">{content.heroIntro}</p>
            <div className="button-row">
              <a className="button button-warm" href="#livro">
                Descobrir o livro
              </a>
              <TrackedLink className="button button-outline" href={content.planUrl} target="_blank" rel="noreferrer" eventName="plan_click">
                Começar gratuitamente
              </TrackedLink>
            </div>
            <div className="trust-line" aria-label="Informações principais">
              <span>História real</span>
              <span>Reflexões acessíveis</span>
              <span>Plano gratuito</span>
            </div>
          </div>

          <figure className="book-stage" aria-label="Capa oficial do livro O Que Restou de Mim">
            <div className="book-shadow" />
            <img
              className="official-cover"
              src={content.coverImageUrl}
              alt="Capa oficial do livro O Que Restou de Mim, de Clodisnei C. Peres"
              width="1000"
              height="1600"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption className="book-caption">
              <span>Livro autobiográfico</span>
              <strong>1ª edição · 2026</strong>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="quote-band section-pad" aria-label="Citação do autor">
        <div className="quote-wrap">
          <span className="quote-mark">“</span>
          <blockquote>{content.centralQuote}</blockquote>
          <p>— Clodisnei Cavalcante Peres</p>
        </div>
      </section>

      <section className="section-pad author-section" id="autor">
        <div className="content-grid author-grid">
          <div className="author-profile">
            <figure className="author-photo-frame">
              <img
                src={content.authorImageUrl}
                alt="Retrato do autor Clodisnei Cavalcante Peres"
                width="900"
                height="1350"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Clodisnei Cavalcante Peres · autor</figcaption>
            </figure>
            <div className="section-heading">
              <p className="eyebrow">Sobre o autor</p>
              <h2>{content.authorTitle}</h2>
              <div className="author-signature">Clodisnei C. Peres</div>
            </div>
          </div>
          <div className="author-story">
            {content.authorParagraphs.slice(0, 2).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {content.authorParagraphs.length > 2 && (
              <details className="author-more">
                <summary>Continuar lendo sobre o autor <span>+</span></summary>
                <div>
                  {content.authorParagraphs.slice(2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </details>
            )}
            <div className="identity-question">
              <p>A pergunta que atravessa a obra</p>
              <strong>“Se eu não posso mais fazer tudo o que fazia, quem sou eu agora?”</strong>
            </div>
            <div className="author-knowledge">
              <p>Formação e áreas de estudo</p>
              <div>
                <span>Hipnose clínica</span><span>PNL</span><span>Massoterapia</span><span>Filosofia</span><span>Economia</span><span>Neurociência</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasVideo && (
        <section className="section-pad video-section" id="video">
          <div className="content-grid video-section-grid">
            <div className="video-heading">
              <p className="eyebrow light">Em minhas próprias palavras</p>
              <h2>{content.videoTitle}</h2>
              <p>{content.videoIntro}</p>
              <div className="video-author-line">
                <img src={content.authorImageUrl} alt="" width="900" height="1350" loading="lazy" decoding="async" />
                <span><strong>Clodisnei C. Peres</strong><small>Autor de O Que Restou de Mim</small></span>
              </div>
            </div>
            <div className="video-content">
              <video controls playsInline preload="metadata" poster={content.videoPosterUrl || content.authorImageUrl}>
                <source src={content.videoUrl} />
                {content.videoCaptionsUrl && <track kind="captions" src={content.videoCaptionsUrl} srcLang="pt-BR" label="Português" default />}
                Seu navegador não consegue reproduzir este vídeo.
              </video>
              {content.videoTranscript && (
                <details className="video-transcript">
                  <summary>Ler a transcrição do vídeo <span>+</span></summary>
                  <div>
                    {content.videoTranscript.split(/\n\s*\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </details>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="section-pad book-section" id="livro">
        <div className="content-grid book-intro-grid">
          <div className="section-heading">
            <p className="eyebrow light">Por dentro da obra</p>
            <h2>{content.bookTitle}</h2>
          </div>
          <div>
            <p className="section-lead light-text">{content.bookSummary}</p>
            <p className="book-promise">{content.bookPromise}</p>
          </div>
        </div>

        <div className="topic-grid">
          {content.bookTopics.map((topic, index) => (
            <article className="topic-card" key={topic}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{topic}</h3>
            </article>
          ))}
        </div>

        <div className="book-cta">
          <div>
            <p className="eyebrow light">O convite do livro</p>
            <h3>Olhar para o que foi perdido sem deixar de reconhecer o que ainda pode ser construído.</h3>
          </div>
          {(publishedBookLinks.length > 0 || content.bookSampleUrl) ? (
            <div className="book-cta-actions">
              {content.bookSampleUrl && (
                <TrackedLink className="button button-ghost" href={content.bookSampleUrl} target="_blank" rel="noreferrer" eventName="sample_click">
                  Ler uma amostra gratuita
                </TrackedLink>
              )}
              {publishedBookLinks.map((item, index) => (
                <TrackedLink className={`button ${index === 0 ? "button-cream" : "button-ghost"}`} href={item.url} target="_blank" rel="noreferrer" eventName="book_click" key={item.id}>
                  <span>{item.label}{item.detail && <small>{item.detail}</small>}</span>
                </TrackedLink>
              ))}
            </div>
          ) : (
            <span className="availability-note">Links de compra serão publicados aqui</span>
          )}
        </div>
      </section>

      {publishedTestimonials.length > 0 && (
        <section className="section-pad testimonial-section" id="depoimentos">
          <div className="section-heading centered-heading compact-heading">
            <p className="eyebrow">Vozes de quem já conheceu o projeto</p>
            <h2>Experiências compartilhadas com verdade</h2>
          </div>
          <div className="testimonial-grid">
            {publishedTestimonials.map((testimonial) => (
              <figure className="testimonial-card" key={testimonial.id}>
                <blockquote>“{testimonial.text}”</blockquote>
                <figcaption><strong>{testimonial.name}</strong>{testimonial.context && <span>{testimonial.context}</span>}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="section-pad benefits-section" id="beneficios">
        <div className="section-heading centered-heading">
          <p className="eyebrow">O que a leitura pode despertar</p>
          <h2>Benefícios possíveis para quem está vivendo um tempo de mudança</h2>
          <p>
            Cada experiência é única. O livro não promete fórmulas: ele oferece companhia, linguagem e perguntas para um recomeço mais consciente.
          </p>
        </div>
        <div className="benefit-grid">
          {content.benefits.map((benefit, index) => (
            <article className="benefit-card" key={benefit.title}>
              <span className="benefit-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pad audience-section">
        <div className="content-grid audience-grid">
          <div className="section-heading">
            <p className="eyebrow light">Para quem é</p>
            <h2>Para quem sente que a vida mudou — e precisa se reconhecer novamente.</h2>
          </div>
          <ul className="audience-list">
            {content.audience.map((item) => (
              <li key={item}>
                <span>✓</span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-pad pathway-section">
        <div className="section-heading centered-heading compact-heading">
          <p className="eyebrow">Um caminho que continua</p>
          <h2>Do relato pessoal à sua própria reflexão</h2>
        </div>
        <div className="pathway-grid">
          {pathway.map((item) => (
            <article className="pathway-card" key={item.number}>
              <span className="pathway-number">{item.number}</span>
              <p className="eyebrow">{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pad plan-section" id="plano">
        <div className="plan-panel">
          <div className="plan-copy">
            <p className="eyebrow light">Gratuito · aberto a todos</p>
            <h2>{content.planTitle}</h2>
            <p>{content.planDescription}</p>
            <TrackedLink className="button button-cream" href={content.planUrl} target="_blank" rel="noreferrer" eventName="plan_click">
              Acessar o Plano de 30 Dias
            </TrackedLink>
          </div>
          <div className="plan-days" aria-hidden="true">
            <span>30</span>
            <strong>dias</strong>
            <p>para iniciar seu recomeço</p>
          </div>
        </div>
      </section>

      {publishedReflections.length > 0 && (
        <section className="section-pad reflections-section" id="reflexoes">
          <div className="content-grid">
            <div className="section-heading reflections-heading">
              <div>
                <p className="eyebrow">Reflexões para continuar o caminho</p>
                <h2>Textos sobre consciência, perdas e recomeços</h2>
              </div>
              <p>Um espaço em constante construção para aprofundar ideias do livro e da jornada.</p>
            </div>
            <div className="reflection-grid">
              {publishedReflections.slice(0, 6).map((reflection) => (
                <article className="reflection-card" key={reflection.id}>
                  <time dateTime={reflection.publishedAt}>{formatDate(reflection.publishedAt)}</time>
                  <h3>{reflection.title}</h3>
                  <p>{reflection.excerpt || reflection.body.slice(0, 180)}</p>
                  <Link href={`/reflexoes/${reflection.slug}`}>Ler reflexão <span aria-hidden="true">→</span></Link>
                </article>
              ))}
            </div>
            <div className="reflection-archive-action">
              <Link className="button button-outline" href="/reflexoes">Ver todas as reflexões</Link>
            </div>
          </div>
        </section>
      )}

      <section className="section-pad journey-section" id="jornada">
        <div className="journey-panel">
          <figure className="journey-cover-stage">
            <div className="journey-cover-glow" aria-hidden="true" />
            <img src={content.journeyCoverUrl} alt="Capa da Jornada de Ampliação e Integração da Consciência, de Clodisnei C. Peres" width="1280" height="2048" loading="lazy" decoding="async" />
            <figcaption>Projeto em desenvolvimento</figcaption>
          </figure>
          <div className="journey-copy">
            <div className="status-badge"><span />{content.journeyStatus}</div>
            <p className="eyebrow">Próximo projeto</p>
            <h2>{content.journeyTitle}</h2>
            <p>{content.journeyDescription}</p>
            <div className="journey-principles">
              <span>Autoconsciência</span>
              <span>Metacognição</span>
              <span>Integração</span>
              <span>Perguntas reflexivas</span>
            </div>
            <p className="journey-note">
              Ela será apresentada no tempo certo. Por enquanto, este espaço permite acompanhar o projeto sem confundi-lo com um produto já disponível.
            </p>
            <JourneyWaitlistForm />
          </div>
        </div>
      </section>

      <section className="section-pad faq-section" id="perguntas">
        <div className="content-grid faq-grid">
          <div className="section-heading sticky-heading">
            <p className="eyebrow">Perguntas frequentes</p>
            <h2>Antes de começar</h2>
          </div>
          <div className="faq-list">
            {publishedFaqs.map((item) => (
              <details key={item.id}>
                <summary>{item.question}<span>+</span></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {content.newsletterPublished && (
        <section className="section-pad newsletter-section" id="novidades">
          <div className="newsletter-panel">
            <div><p className="eyebrow light">Acompanhe este caminho</p><h2>{content.newsletterTitle}</h2><p>{content.newsletterDescription}</p></div>
            <NewsletterForm />
          </div>
        </section>
      )}

      {hasContact && (
        <section className="section-pad contact-section" id="contato">
          <div className="content-grid contact-grid">
            <div className="section-heading">
              <p className="eyebrow light">Contato e canais oficiais</p>
              <h2>{content.contactTitle}</h2>
              <p>{content.contactDescription}</p>
              <div className="contact-actions">
                {content.contactEmail && <a className="button button-cream" href={`mailto:${content.contactEmail}`}>Enviar um e-mail</a>}
                {content.pressKitUrl && <TrackedLink className="button button-ghost" href={content.pressKitUrl} target="_blank" rel="noreferrer" eventName="press_click">Baixar kit de imprensa</TrackedLink>}
              </div>
            </div>
            {publishedSocialLinks.length > 0 && (
              <div className="channel-grid" aria-label="Canais oficiais de Clodisnei C. Peres">
                {publishedSocialLinks.map((item) => (
                  <TrackedLink className="channel-card" href={item.url} target="_blank" rel="noreferrer" eventName="social_click" key={item.id}>
                    <span className="channel-mark" aria-hidden="true">{platformMark(item.platform)}</span>
                    <span><small>{item.platform}</small><strong>{item.label}</strong></span>
                    <span aria-hidden="true">↗</span>
                  </TrackedLink>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="section-pad final-cta">
        <div className="final-card">
          <img className="final-author-photo" src={content.secondaryImageUrl || content.authorImageUrl} alt="Clodisnei Cavalcante Peres" width="900" height="1350" loading="lazy" decoding="async" />
          <div>
            <p className="eyebrow light">Seu primeiro passo pode ser simples</p>
            <h2>Recomeçar não é apagar o que aconteceu. É descobrir o que ainda pode nascer daqui.</h2>
            <p>Conheça a obra, faça o plano gratuitamente e acompanhe os próximos projetos de Clodisnei Cavalcante Peres.</p>
            <div className="button-row centered-buttons">
              <TrackedLink className="button button-cream" href={content.planUrl} target="_blank" rel="noreferrer" eventName="plan_click">
                Começar o plano gratuito
              </TrackedLink>
              <a className="button button-ghost" href="#livro">Conhecer o livro</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <strong>Clodisnei Cavalcante Peres</strong>
            <p>Autor de O Que Restou de Mim</p>
          </div>
          {publishedSocialLinks.length > 0 && (
            <div className="social-links" aria-label="Redes sociais">
              {publishedSocialLinks.map((item) => <TrackedLink href={item.url} target="_blank" rel="noreferrer" eventName="social_click" key={item.id}>{item.platform}</TrackedLink>)}
            </div>
          )}
          <div className="footer-meta">
            <p>Conteúdo educativo e reflexivo. Não substitui acompanhamento profissional.</p>
            <div><a href="/privacidade">Privacidade</a><a href="https://clodisnei-peres.clodisneicp.chatgpt.site/admin">Área administrativa</a></div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

function platformMark(platform: string): string {
  const marks: Record<string, string> = {
    Instagram: "IG", TikTok: "TT", YouTube: "YT", Facebook: "FB", WhatsApp: "WA", LinkedIn: "IN",
    Spotify: "SP", Threads: "TH", Skoob: "SK", Goodreads: "GR", Amazon: "AZ", "Clube de Autores": "CA", Hotmart: "HM",
  };
  return marks[platform] || platform.slice(0, 2).toUpperCase();
}
