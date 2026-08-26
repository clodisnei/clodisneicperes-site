"use client";

import { FormEvent, useState } from "react";
import type { BookLink, FaqItem, Reflection, SiteContent, SocialLink, Testimonial } from "@/lib/site-content";

type Props = { initialContent: SiteContent };

const joinParagraphs = (items: string[]) => items.join("\n\n");
const joinLines = (items: string[]) => items.join("\n");
const joinBenefits = (items: SiteContent["benefits"]) => items.map((item) => `${item.title} | ${item.text}`).join("\n");
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const imageKinds = new Set(["cover", "author", "secondary", "journeyCover", "videoPoster"]);
const maximumImageUploadSize = 900 * 1024;
const maximumImageDimension = 2000;

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("Não foi possível preparar esta imagem.")),
      "image/webp",
      quality,
    );
  });
}

function verifyImageUrl(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const separator = url.includes("?") ? "&" : "?";
    const timeout = window.setTimeout(() => {
      image.src = "";
      reject(new Error("A imagem demorou demais para abrir. A foto anterior foi mantida."));
    }, 15000);
    image.onload = () => {
      window.clearTimeout(timeout);
      if (image.naturalWidth > 0 && image.naturalHeight > 0) resolve();
      else reject(new Error("A imagem enviada não pôde ser exibida. A foto anterior foi mantida."));
    };
    image.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error("A imagem foi enviada, mas o armazenamento ainda não conseguiu entregá-la. A foto anterior foi mantida."));
    };
    image.src = `${url}${separator}preview=${Date.now()}`;
  });
}

async function optimizeImage(file: File): Promise<File> {
  if (file.size <= maximumImageUploadSize) return file;

  const bitmap = await createImageBitmap(file);
  try {
    const initialScale = Math.min(1, maximumImageDimension / Math.max(bitmap.width, bitmap.height));
    let width = Math.max(1, Math.round(bitmap.width * initialScale));
    let height = Math.max(1, Math.round(bitmap.height * initialScale));
    let bestBlob: Blob | null = null;

    for (let resizeAttempt = 0; resizeAttempt < 5; resizeAttempt += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Seu navegador não conseguiu preparar esta imagem.");
      context.drawImage(bitmap, 0, 0, width, height);

      for (const quality of [0.86, 0.74, 0.62, 0.5]) {
        const blob = await canvasToBlob(canvas, quality);
        if (!bestBlob || blob.size < bestBlob.size) bestBlob = blob;
        if (blob.size <= maximumImageUploadSize) {
          const baseName = file.name.replace(/\.[^.]+$/, "") || "imagem";
          return new File([blob], `${baseName}.webp`, { type: "image/webp", lastModified: Date.now() });
        }
      }

      width = Math.max(1, Math.round(width * 0.78));
      height = Math.max(1, Math.round(height * 0.78));
    }

    if (bestBlob && bestBlob.size <= maximumImageUploadSize) {
      const baseName = file.name.replace(/\.[^.]+$/, "") || "imagem";
      return new File([bestBlob], `${baseName}.webp`, { type: "image/webp", lastModified: Date.now() });
    }
    throw new Error("A imagem continuou muito grande depois da otimização. Escolha outra foto.");
  } finally {
    bitmap.close();
  }
}

export default function AdminEditor({ initialContent }: Props) {
  const [content, setContent] = useState(initialContent);
  const [authorBiography, setAuthorBiography] = useState(joinParagraphs(initialContent.authorBiography));
  const [completedTraining, setCompletedTraining] = useState(joinLines(initialContent.completedTraining));
  const [degreesInProgress, setDegreesInProgress] = useState(joinLines(initialContent.degreesInProgress));
  const [ongoingStudies, setOngoingStudies] = useState(joinLines(initialContent.ongoingStudies));
  const [authorParagraphs, setAuthorParagraphs] = useState(joinParagraphs(initialContent.authorParagraphs));
  const [bookTopics, setBookTopics] = useState(joinLines(initialContent.bookTopics));
  const [audience, setAudience] = useState(joinLines(initialContent.audience));
  const [benefits, setBenefits] = useState(joinBenefits(initialContent.benefits));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState<"cover" | "author" | "secondary" | "journeyCover" | "videoPoster" | "video" | "captions" | "sample" | "pressKit" | null>(null);

  const update = (field: keyof SiteContent, value: string) => {
    setContent((current) => ({ ...current, [field]: value }));
    setStatus("idle");
  };

  async function uploadMedia(
    kind: "cover" | "author" | "secondary" | "journeyCover" | "videoPoster" | "video" | "captions" | "sample" | "pressKit",
    field: "coverImageUrl" | "authorImageUrl" | "secondaryImageUrl" | "journeyCoverUrl" | "videoPosterUrl" | "videoUrl" | "videoCaptionsUrl" | "bookSampleUrl" | "pressKitUrl",
    file?: File,
  ) {
    if (!file) return;
    setUploading(kind);
    setStatus("idle");
    setMessage(imageKinds.has(kind) && file.size > maximumImageUploadSize ? "Preparando e reduzindo a imagem..." : "Enviando arquivo...");
    try {
      const uploadFile = imageKinds.has(kind) ? await optimizeImage(file) : file;
      const formData = new FormData();
      formData.set("kind", kind);
      formData.set("file", uploadFile);
      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      const responseText = await response.text();
      let result: { url?: string; error?: string } = {};
      try {
        result = JSON.parse(responseText) as { url?: string; error?: string };
      } catch {
        if (response.status === 413) throw new Error("O arquivo ainda ficou grande demais para o envio. Escolha uma imagem menor.");
      }
      if (!response.ok || !result.url) throw new Error(result.error || "Não foi possível enviar o arquivo.");
      if (imageKinds.has(kind)) {
        setMessage("Verificando a imagem enviada...");
        await verifyImageUrl(result.url);
      }
      setContent((current) => ({ ...current, [field]: result.url as string }));
      setMessage(imageKinds.has(kind)
        ? "Imagem pronta e verificada. Confira a miniatura e clique em “Salvar e publicar alterações”."
        : "Arquivo pronto. Clique em “Salvar e publicar alterações”.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar o arquivo.");
    } finally {
      setUploading(null);
    }
  }

  function addTestimonial() {
    const testimonial: Testimonial = { id: `testimonial-${Date.now()}`, name: "", context: "", text: "", published: false };
    setContent((current) => ({ ...current, testimonials: [...current.testimonials, testimonial] }));
  }

  function updateTestimonial(id: string, patch: Partial<Testimonial>) {
    setContent((current) => ({
      ...current,
      testimonials: current.testimonials.map((item) => item.id === id ? { ...item, ...patch } : item),
    }));
    setStatus("idle");
  }

  function removeTestimonial(id: string) {
    setContent((current) => ({ ...current, testimonials: current.testimonials.filter((item) => item.id !== id) }));
  }

  function addReflection() {
    const reflection: Reflection = {
      id: `reflection-${Date.now()}`,
      slug: "",
      title: "",
      excerpt: "",
      body: "",
      published: false,
      publishedAt: new Date().toISOString().slice(0, 10),
    };
    setContent((current) => ({ ...current, reflections: [...current.reflections, reflection] }));
  }

  function updateReflection(id: string, patch: Partial<Reflection>) {
    setContent((current) => ({
      ...current,
      reflections: current.reflections.map((item) => item.id === id ? { ...item, ...patch } : item),
    }));
    setStatus("idle");
  }

  function removeReflection(id: string) {
    setContent((current) => ({ ...current, reflections: current.reflections.filter((item) => item.id !== id) }));
  }

  function addBookLink() {
    const item: BookLink = { id: `book-${Date.now()}`, label: "", detail: "", url: "", published: false };
    setContent((current) => ({ ...current, bookLinks: [...current.bookLinks, item] }));
  }

  function updateBookLink(id: string, patch: Partial<BookLink>) {
    setContent((current) => ({ ...current, bookLinks: current.bookLinks.map((item) => item.id === id ? { ...item, ...patch } : item) }));
    setStatus("idle");
  }

  function addSocialLink() {
    const item: SocialLink = { id: `social-${Date.now()}`, platform: "Instagram", label: "Instagram", url: "", published: false };
    setContent((current) => ({ ...current, socialLinks: [...current.socialLinks, item] }));
  }

  function updateSocialLink(id: string, patch: Partial<SocialLink>) {
    setContent((current) => ({ ...current, socialLinks: current.socialLinks.map((item) => item.id === id ? { ...item, ...patch } : item) }));
    setStatus("idle");
  }

  function addFaq() {
    const item: FaqItem = { id: `faq-${Date.now()}`, question: "", answer: "", published: false };
    setContent((current) => ({ ...current, faqs: [...current.faqs, item] }));
  }

  function updateFaq(id: string, patch: Partial<FaqItem>) {
    setContent((current) => ({ ...current, faqs: current.faqs.map((item) => item.id === id ? { ...item, ...patch } : item) }));
    setStatus("idle");
  }

  function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
    const target = index + direction;
    if (target < 0 || target >= items.length) return items;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  }

  function buildPayload(): SiteContent {
    return {
      ...content,
      authorBiography: authorBiography.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean),
      completedTraining: completedTraining.split("\n").map((item) => item.trim()).filter(Boolean),
      degreesInProgress: degreesInProgress.split("\n").map((item) => item.trim()).filter(Boolean),
      ongoingStudies: ongoingStudies.split("\n").map((item) => item.trim()).filter(Boolean),
      authorParagraphs: authorParagraphs.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean),
      bookTopics: bookTopics.split("\n").map((item) => item.trim()).filter(Boolean),
      audience: audience.split("\n").map((item) => item.trim()).filter(Boolean),
      benefits: benefits.split("\n").map((line) => {
        const [title, ...rest] = line.split("|");
        return { title: title.trim(), text: rest.join("|").trim() };
      }).filter((item) => item.title && item.text),
    };
  }

  function previewChanges() {
    localStorage.setItem("clodisnei-site-draft-preview", JSON.stringify(buildPayload()));
    window.open("/admin/preview", "_blank", "noopener,noreferrer");
  }

  function downloadBackup() {
    const blob = new Blob([JSON.stringify(buildPayload(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `copia-site-clodisnei-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function restoreBackup(file?: File) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as Partial<SiteContent>;
      if (!parsed.heroTitle || !Array.isArray(parsed.authorParagraphs) || !Array.isArray(parsed.bookTopics)) throw new Error("O arquivo não é uma cópia válida deste site.");
      const restored = {
        ...initialContent,
        ...parsed,
        authorBiography: parsed.authorBiography ?? initialContent.authorBiography,
        completedTraining: parsed.completedTraining ?? initialContent.completedTraining,
        degreesInProgress: parsed.degreesInProgress ?? initialContent.degreesInProgress,
        ongoingStudies: parsed.ongoingStudies ?? initialContent.ongoingStudies,
        authorParagraphs: parsed.authorParagraphs ?? initialContent.authorParagraphs,
        bookTopics: parsed.bookTopics ?? initialContent.bookTopics,
        audience: parsed.audience ?? initialContent.audience,
        benefits: parsed.benefits ?? initialContent.benefits,
        testimonials: parsed.testimonials ?? initialContent.testimonials,
        reflections: parsed.reflections ?? initialContent.reflections,
        faqs: parsed.faqs ?? initialContent.faqs,
        socialLinks: parsed.socialLinks ?? initialContent.socialLinks,
        bookLinks: parsed.bookLinks ?? initialContent.bookLinks,
      } as SiteContent;
      setContent(restored);
      setAuthorBiography(joinParagraphs(restored.authorBiography));
      setCompletedTraining(joinLines(restored.completedTraining));
      setDegreesInProgress(joinLines(restored.degreesInProgress));
      setOngoingStudies(joinLines(restored.ongoingStudies));
      setAuthorParagraphs(joinParagraphs(restored.authorParagraphs));
      setBookTopics(joinLines(restored.bookTopics));
      setAudience(joinLines(restored.audience));
      setBenefits(joinBenefits(restored.benefits));
      setStatus("idle");
      setMessage("Cópia restaurada no editor. Revise e clique em “Salvar e publicar alterações” para aplicá-la.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível restaurar esta cópia.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const payload = buildPayload();

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Não foi possível salvar.");
      setContent(payload);
      setStatus("saved");
      setMessage("Alterações publicadas no site.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível salvar.");
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <nav className="admin-section-nav" aria-label="Categorias do painel">
        <a href="#admin-inicio">Início</a><a href="#admin-autor">Autor</a><a href="#admin-livro">Livro</a><a href="#admin-conteudos">Conteúdos</a><a href="#admin-projetos">Projetos</a><a href="#admin-canais">Canais</a><a href="#admin-configuracoes">Configurações</a>
      </nav>
      <fieldset id="admin-inicio">
        <legend>Apresentação principal do autor</legend>
        <label>Chamada curta<input value={content.presentationEyebrow} onChange={(e) => update("presentationEyebrow", e.target.value)} /></label>
        <label>Título principal<textarea rows={3} value={content.presentationTitle} onChange={(e) => update("presentationTitle", e.target.value)} /></label>
        <label>Texto de abertura<textarea rows={4} value={content.presentationIntro} onChange={(e) => update("presentationIntro", e.target.value)} /></label>
        <label>Frase central<textarea rows={3} value={content.centralQuote} onChange={(e) => update("centralQuote", e.target.value)} /></label>
      </fieldset>

      <fieldset id="admin-autor">
        <legend>Sobre o autor</legend>
        <div className="media-field">
          <img src={content.authorImageUrl} alt="Foto atual do autor" />
          <label>Foto do autor <small>JPG, PNG ou WebP. A imagem será otimizada automaticamente.</small><input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading !== null} onChange={(e) => uploadMedia("author", "authorImageUrl", e.target.files?.[0])} /></label>
          {uploading === "author" && <span>Enviando foto...</span>}
        </div>
        <label>Título da seção<textarea rows={3} value={content.authorTitle} onChange={(e) => update("authorTitle", e.target.value)} /></label>
        <label>Biografia oficial <small>Separe os parágrafos deixando uma linha em branco. O texto inicial foi fundamentado no livro.</small><textarea rows={15} value={authorBiography} onChange={(e) => setAuthorBiography(e.target.value)} /></label>
        <label>Formações concluídas <small>Uma formação por linha.</small><textarea rows={5} value={completedTraining} onChange={(e) => setCompletedTraining(e.target.value)} /></label>
        <label>Graduações em andamento <small>Uma informação por linha.</small><textarea rows={5} value={degreesInProgress} onChange={(e) => setDegreesInProgress(e.target.value)} /></label>
        <label>Estudos contínuos <small>Uma área por linha.</small><textarea rows={5} value={ongoingStudies} onChange={(e) => setOngoingStudies(e.target.value)} /></label>
        <div className="media-field">
          <img src={content.secondaryImageUrl || content.authorImageUrl} alt="Segunda foto atual do autor" />
          <label>Segunda foto do autor <small>Usada na seção da trajetória e otimizada automaticamente antes do envio.</small><input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading !== null} onChange={(e) => uploadMedia("secondary", "secondaryImageUrl", e.target.files?.[0])} /></label>
          {uploading === "secondary" && <span>Enviando segunda foto...</span>}
        </div>
      </fieldset>

      <fieldset id="admin-video">
        <legend>Vídeo de apresentação</legend>
        <div className="video-admin-intro">
          <strong>Gravação recomendada</strong>
          <p>Grave na horizontal, em Full HD, com duração entre 1min30 e 2min. Escolha um local silencioso, fale olhando para a câmera e não use música alta. MP4 é o formato mais indicado.</p>
        </div>
        <div className="video-upload-grid">
          <div className="video-admin-preview">
            {content.videoUrl ? (
              <video controls playsInline preload="metadata" poster={content.videoPosterUrl || content.authorImageUrl}>
                <source src={content.videoUrl} />
              </video>
            ) : (
              <div className="video-empty-state"><span>▶</span><p>O vídeo aparecerá aqui depois do envio.</p></div>
            )}
          </div>
          <div className="video-admin-files">
            <label>Arquivo do vídeo <small>MP4, WebM, MOV ou M4V, até 90 MB.</small><input type="file" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" disabled={uploading !== null} onChange={(e) => uploadMedia("video", "videoUrl", e.target.files?.[0])} /></label>
            {uploading === "video" && <span>Enviando vídeo... Aguarde sem fechar a página.</span>}
            <label>Imagem de abertura <small>Opcional. Use uma imagem horizontal JPG, PNG ou WebP; ela será otimizada automaticamente.</small><input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading !== null} onChange={(e) => uploadMedia("videoPoster", "videoPosterUrl", e.target.files?.[0])} /></label>
            {uploading === "videoPoster" && <span>Enviando imagem de abertura...</span>}
            <label>Legendas acessíveis <small>Opcional. Arquivo VTT em português.</small><input type="file" accept=".vtt,text/vtt" disabled={uploading !== null} onChange={(e) => uploadMedia("captions", "videoCaptionsUrl", e.target.files?.[0])} /></label>
            {uploading === "captions" && <span>Enviando legendas...</span>}
          </div>
        </div>
        <label>Título do vídeo<input value={content.videoTitle} onChange={(e) => update("videoTitle", e.target.value)} /></label>
        <label>Apresentação do vídeo<textarea rows={4} value={content.videoIntro} onChange={(e) => update("videoIntro", e.target.value)} /></label>
        <label>Roteiro e transcrição <small>O texto já está preparado para sua gravação. Depois, ajuste para corresponder exatamente ao que foi falado.</small><textarea rows={18} value={content.videoTranscript} onChange={(e) => update("videoTranscript", e.target.value)} /></label>
        <label className="publish-toggle">
          <input
            type="checkbox"
            checked={content.videoPublished}
            onChange={(e) => {
              setContent((current) => ({ ...current, videoPublished: e.target.checked }));
              setStatus("idle");
            }}
          />
          <span><strong>Publicar vídeo no site</strong><small>Ative somente depois de enviar e conferir o vídeo.</small></span>
        </label>
      </fieldset>

      <fieldset id="admin-livro">
        <legend>O livro</legend>
        <div className="media-field cover-media-field">
          <img src={content.coverImageUrl} alt="Capa atual do livro" />
          <label>Capa do livro <small>Use a capa frontal em JPG, PNG ou WebP; ela será otimizada automaticamente.</small><input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading !== null} onChange={(e) => uploadMedia("cover", "coverImageUrl", e.target.files?.[0])} /></label>
          {uploading === "cover" && <span>Enviando capa...</span>}
        </div>
        <label>Título da seção<textarea rows={3} value={content.bookTitle} onChange={(e) => update("bookTitle", e.target.value)} /></label>
        <label>Resumo do conteúdo<textarea rows={6} value={content.bookSummary} onChange={(e) => update("bookSummary", e.target.value)} /></label>
        <label>Proposta da obra<textarea rows={5} value={content.bookPromise} onChange={(e) => update("bookPromise", e.target.value)} /></label>
        <label>Temas abordados <small>Um tema por linha.</small><textarea rows={9} value={bookTopics} onChange={(e) => setBookTopics(e.target.value)} /></label>
        <div className="media-field sample-media-field">
          <div className="file-preview">PDF</div>
          <label>Amostra gratuita do livro <small>Opcional. Envie um PDF de até 25 MB.</small><input type="file" accept="application/pdf,.pdf" disabled={uploading !== null} onChange={(e) => uploadMedia("sample", "bookSampleUrl", e.target.files?.[0])} /></label>
          {uploading === "sample" && <span>Enviando amostra...</span>}
          {content.bookSampleUrl && <a href={content.bookSampleUrl} target="_blank" rel="noreferrer">Abrir amostra atual</a>}
        </div>
        <div className="admin-section-intro">
          <p>Adicione separadamente cada opção: livro físico, e-book, Amazon, Clube de Autores ou outra loja.</p>
          <button className="admin-add-button" type="button" onClick={addBookLink}>+ Adicionar opção</button>
        </div>
        <div className="admin-collection">
          {content.bookLinks.length === 0 && <p className="admin-empty">Nenhum link de compra cadastrado.</p>}
          {content.bookLinks.map((item, index) => (
            <article className="admin-item" key={item.id}>
              <div className="admin-item-grid">
                <label>Nome do botão <small>Ex.: Comprar na Amazon.</small><input value={item.label} onChange={(e) => updateBookLink(item.id, { label: e.target.value })} /></label>
                <label>Detalhe <small>Ex.: e-book ou livro físico.</small><input value={item.detail} onChange={(e) => updateBookLink(item.id, { detail: e.target.value })} /></label>
              </div>
              <label>Link completo<input type="url" placeholder="https://..." value={item.url} onChange={(e) => updateBookLink(item.id, { url: e.target.value })} /></label>
              <div className="admin-item-actions">
                <label className="inline-toggle"><input type="checkbox" checked={item.published} onChange={(e) => updateBookLink(item.id, { published: e.target.checked })} /> Publicar no site</label>
                <div className="order-actions">
                  <button type="button" disabled={index === 0} onClick={() => setContent((current) => ({ ...current, bookLinks: moveItem(current.bookLinks, index, -1) }))}>↑</button>
                  <button type="button" disabled={index === content.bookLinks.length - 1} onClick={() => setContent((current) => ({ ...current, bookLinks: moveItem(current.bookLinks, index, 1) }))}>↓</button>
                  <button type="button" onClick={() => setContent((current) => ({ ...current, bookLinks: current.bookLinks.filter((link) => link.id !== item.id) }))}>Excluir</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </fieldset>

      <fieldset id="admin-beneficios">
        <legend>Benefícios e leitores</legend>
        <label>Benefícios <small>Uma linha por benefício, no formato: Título | Explicação</small><textarea rows={12} value={benefits} onChange={(e) => setBenefits(e.target.value)} /></label>
        <label>Para quem é <small>Uma descrição por linha.</small><textarea rows={8} value={audience} onChange={(e) => setAudience(e.target.value)} /></label>
      </fieldset>

      <fieldset id="admin-depoimentos">
        <legend>Depoimentos</legend>
        <div className="admin-section-intro">
          <p>Cadastre depoimentos reais quando recebê-los. Eles só aparecem no site quando estiverem marcados como publicados.</p>
          <button className="admin-add-button" type="button" onClick={addTestimonial}>+ Adicionar depoimento</button>
        </div>
        <div className="admin-collection">
          {content.testimonials.length === 0 && <p className="admin-empty">Nenhum depoimento cadastrado.</p>}
          {content.testimonials.map((testimonial) => (
            <article className="admin-item" key={testimonial.id}>
              <div className="admin-item-grid">
                <label>Nome<input value={testimonial.name} onChange={(e) => updateTestimonial(testimonial.id, { name: e.target.value })} /></label>
                <label>Identificação <small>Ex.: leitora, participante do plano.</small><input value={testimonial.context} onChange={(e) => updateTestimonial(testimonial.id, { context: e.target.value })} /></label>
              </div>
              <label>Depoimento<textarea rows={5} value={testimonial.text} onChange={(e) => updateTestimonial(testimonial.id, { text: e.target.value })} /></label>
              <div className="admin-item-actions">
                <label className="inline-toggle"><input type="checkbox" checked={testimonial.published} onChange={(e) => updateTestimonial(testimonial.id, { published: e.target.checked })} /> Publicar no site</label>
                <button type="button" onClick={() => removeTestimonial(testimonial.id)}>Excluir</button>
              </div>
            </article>
          ))}
        </div>
      </fieldset>

      <fieldset id="admin-conteudos">
        <legend>Reflexões e artigos</legend>
        <div className="admin-section-intro">
          <p>Crie textos para manter o site vivo e compartilhar ideias além das redes sociais. Cada reflexão ganha uma página própria.</p>
          <button className="admin-add-button" type="button" onClick={addReflection}>+ Nova reflexão</button>
        </div>
        <div className="admin-collection">
          {content.reflections.length === 0 && <p className="admin-empty">Nenhuma reflexão cadastrada.</p>}
          {content.reflections.map((reflection) => (
            <article className="admin-item" key={reflection.id}>
              <div className="admin-item-grid">
                <label>Título<input value={reflection.title} onChange={(e) => {
                  const title = e.target.value;
                  const shouldUpdateSlug = !reflection.slug || reflection.slug === slugify(reflection.title);
                  updateReflection(reflection.id, { title, ...(shouldUpdateSlug ? { slug: slugify(title) } : {}) });
                }} /></label>
                <label>Endereço da página <small>Use letras minúsculas e hífens.</small><input value={reflection.slug} onChange={(e) => updateReflection(reflection.id, { slug: slugify(e.target.value) })} /></label>
              </div>
              <label>Resumo<textarea rows={3} value={reflection.excerpt} onChange={(e) => updateReflection(reflection.id, { excerpt: e.target.value })} /></label>
              <label>Texto completo <small>Separe os parágrafos deixando uma linha em branco.</small><textarea rows={12} value={reflection.body} onChange={(e) => updateReflection(reflection.id, { body: e.target.value })} /></label>
              <div className="admin-item-grid">
                <label>Data de publicação<input type="date" value={reflection.publishedAt} onChange={(e) => updateReflection(reflection.id, { publishedAt: e.target.value })} /></label>
                <label className="inline-toggle"><input type="checkbox" checked={reflection.published} onChange={(e) => updateReflection(reflection.id, { published: e.target.checked })} /> Publicar no site</label>
              </div>
              <div className="admin-item-actions">
                <span>{reflection.slug ? `/reflexoes/${reflection.slug}` : "Defina o título e o endereço"}</span>
                <button type="button" onClick={() => removeReflection(reflection.id)}>Excluir</button>
              </div>
            </article>
          ))}
        </div>
      </fieldset>

      <fieldset id="admin-plano">
        <legend>Plano de 30 Dias</legend>
        <label>Título<input value={content.planTitle} onChange={(e) => update("planTitle", e.target.value)} /></label>
        <label>Descrição<textarea rows={5} value={content.planDescription} onChange={(e) => update("planDescription", e.target.value)} /></label>
        <label>Link do plano<input type="url" value={content.planUrl} onChange={(e) => update("planUrl", e.target.value)} /></label>
      </fieldset>

      <fieldset id="admin-projetos">
        <legend>Jornada em construção</legend>
        <div className="media-field cover-media-field">
          <img src={content.journeyCoverUrl} alt="Capa atual da Jornada" />
          <label>Capa da Jornada <small>Use a capa frontal em JPG, PNG ou WebP; ela será otimizada automaticamente.</small><input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading !== null} onChange={(e) => uploadMedia("journeyCover", "journeyCoverUrl", e.target.files?.[0])} /></label>
          {uploading === "journeyCover" && <span>Enviando capa da Jornada...</span>}
        </div>
        <label>Status<input value={content.journeyStatus} onChange={(e) => update("journeyStatus", e.target.value)} /></label>
        <label>Nome da Jornada<textarea rows={2} value={content.journeyTitle} onChange={(e) => update("journeyTitle", e.target.value)} /></label>
        <label>Apresentação<textarea rows={7} value={content.journeyDescription} onChange={(e) => update("journeyDescription", e.target.value)} /></label>
      </fieldset>

      <fieldset id="admin-novidades">
        <legend>Lista geral de novidades</legend>
        <div className="admin-section-intro"><p>Este cadastro é separado da lista de interessados na Jornada e pode ser usado para novas reflexões, livro e projetos futuros.</p></div>
        <label>Título<input value={content.newsletterTitle} onChange={(e) => update("newsletterTitle", e.target.value)} /></label>
        <label>Descrição<textarea rows={4} value={content.newsletterDescription} onChange={(e) => update("newsletterDescription", e.target.value)} /></label>
        <label className="publish-toggle"><input type="checkbox" checked={content.newsletterPublished} onChange={(e) => { setContent((current) => ({ ...current, newsletterPublished: e.target.checked })); setStatus("idle"); }} /><span><strong>Publicar cadastro de novidades</strong><small>Ative quando quiser começar a formar sua lista geral de leitores.</small></span></label>
      </fieldset>

      <fieldset id="admin-perguntas">
        <legend>Perguntas frequentes</legend>
        <div className="admin-section-intro">
          <p>Edite as respostas e acrescente dúvidas que seus leitores enviarem.</p>
          <button className="admin-add-button" type="button" onClick={addFaq}>+ Nova pergunta</button>
        </div>
        <div className="admin-collection">
          {content.faqs.map((item, index) => (
            <article className="admin-item" key={item.id}>
              <label>Pergunta<input value={item.question} onChange={(e) => updateFaq(item.id, { question: e.target.value })} /></label>
              <label>Resposta<textarea rows={4} value={item.answer} onChange={(e) => updateFaq(item.id, { answer: e.target.value })} /></label>
              <div className="admin-item-actions">
                <label className="inline-toggle"><input type="checkbox" checked={item.published} onChange={(e) => updateFaq(item.id, { published: e.target.checked })} /> Publicar no site</label>
                <div className="order-actions">
                  <button type="button" disabled={index === 0} onClick={() => setContent((current) => ({ ...current, faqs: moveItem(current.faqs, index, -1) }))}>↑</button>
                  <button type="button" disabled={index === content.faqs.length - 1} onClick={() => setContent((current) => ({ ...current, faqs: moveItem(current.faqs, index, 1) }))}>↓</button>
                  <button type="button" onClick={() => setContent((current) => ({ ...current, faqs: current.faqs.filter((faq) => faq.id !== item.id) }))}>Excluir</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </fieldset>

      <fieldset id="admin-canais">
        <legend>Redes, plataformas e canais</legend>
        <div className="admin-section-intro">
          <p>Cadastre quantos canais desejar. No site aparecem somente aqueles que estiverem publicados.</p>
          <button className="admin-add-button" type="button" onClick={addSocialLink}>+ Adicionar canal</button>
        </div>
        <div className="admin-collection">
          {content.socialLinks.length === 0 && <p className="admin-empty">Nenhum canal cadastrado.</p>}
          {content.socialLinks.map((item, index) => (
            <article className="admin-item" key={item.id}>
              <div className="admin-item-grid">
                <label>Plataforma<select value={item.platform} onChange={(e) => updateSocialLink(item.id, { platform: e.target.value, label: item.label || e.target.value })}>
                  {socialPlatforms.map((platform) => <option key={platform}>{platform}</option>)}
                </select></label>
                <label>Nome exibido <small>Ex.: Meu canal no YouTube.</small><input value={item.label} onChange={(e) => updateSocialLink(item.id, { label: e.target.value })} /></label>
              </div>
              <label>Link completo<input type="url" placeholder="https://..." value={item.url} onChange={(e) => updateSocialLink(item.id, { url: e.target.value })} /></label>
              <div className="admin-item-actions">
                <label className="inline-toggle"><input type="checkbox" checked={item.published} onChange={(e) => updateSocialLink(item.id, { published: e.target.checked })} /> Publicar no site</label>
                <div className="order-actions">
                  <button type="button" disabled={index === 0} onClick={() => setContent((current) => ({ ...current, socialLinks: moveItem(current.socialLinks, index, -1) }))}>↑</button>
                  <button type="button" disabled={index === content.socialLinks.length - 1} onClick={() => setContent((current) => ({ ...current, socialLinks: moveItem(current.socialLinks, index, 1) }))}>↓</button>
                  <button type="button" onClick={() => setContent((current) => ({ ...current, socialLinks: current.socialLinks.filter((link) => link.id !== item.id) }))}>Excluir</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </fieldset>

      <fieldset id="admin-contato">
        <legend>Contato e imprensa</legend>
        <label>Título<input value={content.contactTitle} onChange={(e) => update("contactTitle", e.target.value)} /></label>
        <label>E-mail público <small>Deixe vazio se não quiser exibir um e-mail.</small><input type="email" placeholder="contato@seudominio.com.br" value={content.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} /></label>
        <label>Apresentação<textarea rows={5} value={content.contactDescription} onChange={(e) => update("contactDescription", e.target.value)} /></label>
        <div className="media-field sample-media-field">
          <div className="file-preview">PDF</div>
          <label>Kit de imprensa <small>Opcional. PDF com biografia, livro, fotos e informações para entrevistas.</small><input type="file" accept="application/pdf,.pdf" disabled={uploading !== null} onChange={(e) => uploadMedia("pressKit", "pressKitUrl", e.target.files?.[0])} /></label>
          {uploading === "pressKit" && <span>Enviando kit de imprensa...</span>}
          {content.pressKitUrl && <a href={content.pressKitUrl} target="_blank" rel="noreferrer">Abrir kit atual</a>}
        </div>
      </fieldset>

      <fieldset id="admin-configuracoes">
        <legend>SEO, domínio e integrações</legend>
        <div className="admin-section-intro"><p>A estrutura do site já está preparada para domínio próprio, indexação e automação de e-mails. Preencha somente os códigos fornecidos pelos serviços oficiais.</p></div>
        <label>Verificação do Google Search Console <small>Cole apenas o código de verificação da meta tag, sem aspas e sem o restante do HTML.</small><input placeholder="Código fornecido pelo Google" value={content.googleSiteVerification} onChange={(e) => update("googleSiteVerification", e.target.value.trim())} /></label>
        <div className="admin-info-card"><strong>Domínio próprio</strong><p>Quando você escolher e registrar o domínio, ele poderá ser conectado sem reconstruir o site.</p></div>
        <div className="admin-info-card"><strong>Envio automático de e-mails</strong><p>Os cadastros já estão preparados para uma integração segura. A ativação será feita quando você escolher a plataforma de e-mail.</p></div>
      </fieldset>

      <div className="admin-savebar">
        <div aria-live="polite" className={`save-message ${status}`}>{message}</div>
        <button className="admin-secondary-action" type="button" onClick={downloadBackup}>Baixar cópia</button>
        <label className="admin-secondary-action restore-action">Restaurar cópia<input type="file" accept="application/json,.json" onChange={(event) => restoreBackup(event.target.files?.[0])} /></label>
        <button className="admin-secondary-action" type="button" onClick={previewChanges}>Pré-visualizar</button>
        <button className="button button-warm" disabled={status === "saving" || uploading !== null} type="submit">
          {uploading !== null ? "Aguarde o envio..." : status === "saving" ? "Salvando..." : "Salvar e publicar alterações"}
        </button>
      </div>
    </form>
  );
}

const socialPlatforms = ["Instagram", "TikTok", "YouTube", "Facebook", "WhatsApp", "LinkedIn", "Spotify", "Threads", "Skoob", "Goodreads", "Amazon", "Clube de Autores", "Hotmart", "Outro"];
