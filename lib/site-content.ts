import { env } from "cloudflare:workers";

export type Benefit = { title: string; text: string };
export type Testimonial = { id: string; name: string; context: string; text: string; published: boolean };
export type Reflection = { id: string; slug: string; title: string; excerpt: string; body: string; published: boolean; publishedAt: string };
export type SocialLink = { id: string; platform: string; label: string; url: string; published: boolean };
export type BookLink = { id: string; label: string; detail: string; url: string; published: boolean };
export type FaqItem = { id: string; question: string; answer: string; published: boolean };

export type SiteContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroIntro: string;
  centralQuote: string;
  authorTitle: string;
  authorParagraphs: string[];
  bookTitle: string;
  bookSummary: string;
  bookPromise: string;
  bookTopics: string[];
  benefits: Benefit[];
  audience: string[];
  planTitle: string;
  planDescription: string;
  planUrl: string;
  journeyStatus: string;
  journeyTitle: string;
  journeyDescription: string;
  journeyCoverUrl: string;
  coverImageUrl: string;
  authorImageUrl: string;
  secondaryImageUrl: string;
  videoUrl: string;
  videoPosterUrl: string;
  videoCaptionsUrl: string;
  videoTitle: string;
  videoIntro: string;
  videoTranscript: string;
  videoPublished: boolean;
  bookPurchaseUrl: string;
  bookSampleUrl: string;
  bookLinks: BookLink[];
  testimonials: Testimonial[];
  reflections: Reflection[];
  faqs: FaqItem[];
  socialLinks: SocialLink[];
  contactTitle: string;
  contactDescription: string;
  contactEmail: string;
  pressKitUrl: string;
  newsletterTitle: string;
  newsletterDescription: string;
  newsletterPublished: boolean;
  googleSiteVerification: string;
  instagramUrl: string;
  tiktokUrl: string;
  whatsappUrl: string;
};

export const defaultSiteContent: SiteContent = {
  heroEyebrow: "Livro · reflexão · recomeço",
  heroTitle: "Quando a vida muda por inteiro, ainda é possível reconstruir quem somos.",
  heroIntro:
    "O Que Restou de Mim é o relato de Clodisnei Cavalcante Peres sobre perdas, identidade e reconstrução. Uma história verdadeira que aproxima experiência de vida, espiritualidade e ferramentas de autoconhecimento.",
  centralQuote:
    "O que restou de mim não foi apenas uma parte do homem que eu era. Foi a matéria com a qual comecei a construir o homem que sou.",
  authorTitle: "Uma vida atravessada por perdas — e transformada pela decisão de continuar.",
  authorParagraphs: [
    "Clodisnei Cavalcante Peres nasceu em Paranavaí, no Paraná. Antes das grandes mudanças que atravessariam sua vida, trabalhou com manutenção patrimonial, exercendo atividades que exigiam autonomia, movimento e visão. Dirigir, treinar, pedalar e trabalhar com as próprias mãos faziam parte de quem ele acreditava ser.",
    "A perda progressiva da visão alterou sua rotina, seus projetos e a maneira como se reconhecia. O desafio deixou de ser apenas adaptar tarefas: tornou-se necessário reconstruir a própria identidade diante de limites que não havia escolhido.",
    "Nesse processo, encontrou apoio na família, na fé, nos estudos e em práticas de autoconhecimento. A hipnose, a Programação Neurolinguística, a neurociência, a filosofia e outras áreas passaram a ajudá-lo a compreender pensamentos, emoções, hábitos e possibilidades de recomeço.",
    "O livro nasceu quando a experiência pessoal deixou de ser apenas uma história de dor e se transformou em uma pergunta compartilhável: o que permanece em nós quando aquilo que fazíamos, planejávamos ou acreditávamos ser já não pode continuar da mesma forma?",
  ],
  bookTitle: "Uma narrativa sobre perdas, identidade e a coragem de recomeçar.",
  bookSummary:
    "Em vinte capítulos, Clodisnei percorre momentos de ruptura, adaptação e reconstrução. O leitor acompanha não apenas o que aconteceu, mas as perguntas que surgiram quando antigas certezas deixaram de existir e foi preciso aprender a viver de outro modo.",
  bookPromise:
    "A obra aproxima relato autobiográfico e reflexão, sem transformar a experiência do autor em receita universal. A história é um ponto de encontro para que cada pessoa observe a própria caminhada com mais honestidade, cuidado e esperança.",
  bookTopics: [
    "A perda e o impacto sobre a identidade",
    "A diferença entre aceitar e desistir",
    "Fé, espiritualidade e sentido",
    "Hipnose e a relação com a mente",
    "PNL, linguagem e novas perspectivas",
    "Neurociência, hábitos e reconstrução",
    "Pequenos passos diante de grandes mudanças",
    "Autoconhecimento e responsabilidade pessoal",
  ],
  benefits: [
    { title: "Sentir-se compreendido", text: "Reconhecer em uma história real emoções que muitas vezes são difíceis de explicar para quem está ao redor." },
    { title: "Rever a própria identidade", text: "Refletir sobre quem somos para além do trabalho, das habilidades, dos papéis e daquilo que conseguimos fazer." },
    { title: "Dar nome ao processo", text: "Encontrar uma linguagem acessível para compreender perdas, adaptação, hábitos, pensamentos e recomeço." },
    { title: "Perceber possibilidades", text: "Olhar para o que permanece disponível e reconhecer pequenas escolhas possíveis no presente." },
    { title: "Fazer perguntas melhores", text: "Substituir respostas prontas por perguntas capazes de produzir reflexão, consciência e movimento interior." },
    { title: "Começar no próprio ritmo", text: "Usar o Plano de 30 Dias como continuidade prática e gratuita, sem pressão por transformações instantâneas." },
  ],
  audience: [
    "Pessoas atravessando perdas, mudanças inesperadas ou períodos de reconstrução.",
    "Quem sente que perdeu parte da identidade depois de uma limitação ou ruptura.",
    "Leitores interessados em autoconhecimento, hábitos, mente e espiritualidade.",
    "Quem procura uma história humana, sem discursos de perfeição ou fórmulas mágicas.",
    "Pessoas que desejam transformar reflexão em pequenos passos possíveis.",
  ],
  planTitle: "Plano de 30 Dias para seu Recomeço",
  planDescription:
    "Uma experiência digital com perguntas, reflexões e pequenas práticas para ajudar você a observar sua história e iniciar um movimento de reconstrução. É gratuito tanto para leitores do livro quanto para qualquer pessoa que queira participar.",
  planUrl: "https://30diasparaseurecomeco.vercel.app/",
  journeyStatus: "Em desenvolvimento",
  journeyTitle: "Jornada de Ampliação e Integração da Consciência",
  journeyDescription:
    "Um projeto de aprofundamento baseado em perguntas, exercícios, meditações e reflexões para ajudar cada participante a observar a própria consciência, reduzir automatismos e integrar o que aprende à vida cotidiana. A proposta está sendo construída com profundidade e ainda não está aberta ao público.",
  journeyCoverUrl: "/capa-jornada.webp",
  coverImageUrl: "/capa-oficial.webp",
  authorImageUrl: "/clodisnei-peres.webp",
  secondaryImageUrl: "/clodisnei-peres.webp",
  videoUrl: "",
  videoPosterUrl: "/clodisnei-peres.webp",
  videoCaptionsUrl: "",
  videoTitle: "Uma história contada por quem a viveu",
  videoIntro:
    "Neste vídeo, Clodisnei apresenta a experiência que deu origem ao livro, o propósito do Plano de 30 Dias e os próximos caminhos que estão sendo construídos.",
  videoTranscript:
    "Olá, eu sou Clodisnei Cavalcante Peres. Durante muito tempo, eu acreditava que sabia quem eu era a partir das coisas que conseguia fazer: trabalhar, dirigir, treinar e cuidar da minha vida com autonomia. Quando a perda progressiva da visão mudou minha rotina, eu precisei enfrentar uma pergunta muito mais profunda: se eu não posso mais fazer tudo o que fazia, quem sou eu agora?\n\nFoi desse processo que nasceu O Que Restou de Mim. O livro não foi escrito para oferecer fórmulas prontas. Ele nasceu para compartilhar uma história real sobre perdas, identidade, fé, mente e reconstrução — e para convidar cada leitor a olhar para a própria caminhada com mais honestidade e esperança.\n\nAo longo desse caminho, a hipnose, a Programação Neurolinguística, a neurociência, os estudos e a espiritualidade me ajudaram a compreender pensamentos, emoções, hábitos e possibilidades de recomeço. Não para apagar o que aconteceu, mas para construir uma nova forma de seguir.\n\nPara quem deseja dar um primeiro passo, também criei o Plano de 30 Dias para seu Recomeço. Ele é gratuito e está aberto a qualquer pessoa, tenha ou não adquirido o livro.\n\nE estamos construindo, com calma e profundidade, a Jornada de Ampliação e Integração da Consciência. Ela ainda não está pronta, mas fará parte dos próximos caminhos deste projeto.\n\nSe alguma parte desta história conversar com o momento que você está vivendo, eu convido você a conhecer o livro, acessar gratuitamente o Plano de 30 Dias e acompanhar o que estamos construindo. Talvez recomeçar não seja voltar a ser quem você era. Talvez seja descobrir o que ainda pode nascer daquilo que restou.",
  videoPublished: false,
  bookPurchaseUrl: "",
  bookSampleUrl: "",
  bookLinks: [],
  testimonials: [],
  reflections: [],
  faqs: [
    { id: "faq-plan", question: "Preciso comprar o livro para fazer o Plano de 30 Dias?", answer: "Não. O plano nasceu como uma extensão prática da obra, mas é gratuito e está aberto a qualquer pessoa que deseje iniciar um processo de reflexão e recomeço.", published: true },
    { id: "faq-book", question: "O livro apresenta respostas prontas?", answer: "Não. A proposta é compartilhar uma experiência real e oferecer perspectivas e perguntas para que cada leitor encontre respostas coerentes com a própria história.", published: true },
    { id: "faq-journey", question: "A Jornada já está disponível?", answer: "Ainda não. A Jornada de Ampliação e Integração da Consciência está em desenvolvimento e será apresentada somente quando estiver madura e pronta para receber participantes.", published: true },
    { id: "faq-professional", question: "O conteúdo substitui acompanhamento profissional?", answer: "Não. O livro, o plano e os materiais têm finalidade educativa e reflexiva. Eles não substituem avaliação ou acompanhamento médico, psicológico ou terapêutico.", published: true },
  ],
  socialLinks: [],
  contactTitle: "Vamos conversar sobre o livro e os próximos projetos?",
  contactDescription: "Para convites, entrevistas, parcerias e outras informações, utilize um dos canais oficiais publicados abaixo.",
  contactEmail: "",
  pressKitUrl: "",
  newsletterTitle: "Receba novas reflexões e acompanhe os próximos projetos",
  newsletterDescription: "Cadastre seu e-mail para receber novidades do livro, do Plano de 30 Dias e dos conteúdos publicados por Clodisnei C. Peres.",
  newsletterPublished: false,
  googleSiteVerification: "",
  instagramUrl: "",
  tiktokUrl: "",
  whatsappUrl: "",
};

type D1Result<T> = { content?: T | null };
type Statement = {
  bind: (...values: unknown[]) => Statement;
  first: <T>() => Promise<T | null>;
  run: () => Promise<unknown>;
};
type Database = { prepare: (query: string) => Statement };

function database(): Database | null {
  return (env as unknown as { DB?: Database }).DB ?? null;
}

export async function getSiteContent(): Promise<SiteContent> {
  const db = database();
  if (!db) return defaultSiteContent;
  try {
    const row = await db.prepare("SELECT content FROM site_content WHERE id = ?").bind("main").first<D1Result<string>>();
    if (!row?.content) return defaultSiteContent;
    return mergeSiteContent(JSON.parse(row.content) as Partial<SiteContent>);
  } catch {
    return defaultSiteContent;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  const db = database();
  if (!db) throw new Error("O banco de conteúdo ainda não está disponível.");
  await db.prepare(
    "CREATE TABLE IF NOT EXISTS site_content (id TEXT PRIMARY KEY NOT NULL, content TEXT NOT NULL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)",
  ).run();
  await db
    .prepare("INSERT INTO site_content (id, content, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET content = excluded.content, updated_at = CURRENT_TIMESTAMP")
    .bind("main", JSON.stringify(content))
    .run();
}

export function mergeSiteContent(value: Partial<SiteContent>): SiteContent {
  const migratedSocialLinks = cleanSocialLinks(value.socialLinks);
  if (migratedSocialLinks.length === 0 && !Array.isArray(value.socialLinks)) {
    if (value.instagramUrl) migratedSocialLinks.push({ id: "legacy-instagram", platform: "Instagram", label: "Instagram", url: value.instagramUrl, published: true });
    if (value.tiktokUrl) migratedSocialLinks.push({ id: "legacy-tiktok", platform: "TikTok", label: "TikTok", url: value.tiktokUrl, published: true });
    if (value.whatsappUrl) migratedSocialLinks.push({ id: "legacy-whatsapp", platform: "WhatsApp", label: "WhatsApp", url: value.whatsappUrl, published: true });
  }
  const migratedBookLinks = cleanBookLinks(value.bookLinks);
  if (migratedBookLinks.length === 0 && !Array.isArray(value.bookLinks) && value.bookPurchaseUrl) {
    migratedBookLinks.push({ id: "legacy-book", label: "Conhecer ou adquirir o livro", detail: "", url: value.bookPurchaseUrl, published: true });
  }
  return {
    ...defaultSiteContent,
    ...value,
    authorParagraphs: cleanStringList(value.authorParagraphs, defaultSiteContent.authorParagraphs),
    bookTopics: cleanStringList(value.bookTopics, defaultSiteContent.bookTopics),
    audience: cleanStringList(value.audience, defaultSiteContent.audience),
    benefits: cleanBenefits(value.benefits),
    testimonials: cleanTestimonials(value.testimonials),
    reflections: cleanReflections(value.reflections),
    faqs: cleanFaqs(value.faqs),
    socialLinks: migratedSocialLinks,
    bookLinks: migratedBookLinks,
    videoPublished: value.videoPublished === true,
    newsletterPublished: value.newsletterPublished === true,
  };
}

function cleanSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is SocialLink =>
    Boolean(item) && typeof item === "object" && typeof (item as SocialLink).id === "string" &&
    typeof (item as SocialLink).platform === "string" && typeof (item as SocialLink).label === "string" &&
    typeof (item as SocialLink).url === "string" && typeof (item as SocialLink).published === "boolean",
  );
}

function cleanBookLinks(value: unknown): BookLink[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is BookLink =>
    Boolean(item) && typeof item === "object" && typeof (item as BookLink).id === "string" &&
    typeof (item as BookLink).label === "string" && typeof (item as BookLink).detail === "string" &&
    typeof (item as BookLink).url === "string" && typeof (item as BookLink).published === "boolean",
  );
}

function cleanFaqs(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return defaultSiteContent.faqs;
  return value.filter((item): item is FaqItem =>
    Boolean(item) && typeof item === "object" && typeof (item as FaqItem).id === "string" &&
    typeof (item as FaqItem).question === "string" && typeof (item as FaqItem).answer === "string" &&
    typeof (item as FaqItem).published === "boolean",
  );
}

function cleanTestimonials(value: unknown): Testimonial[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Testimonial =>
    Boolean(item) && typeof item === "object" && typeof (item as Testimonial).id === "string" &&
    typeof (item as Testimonial).name === "string" && typeof (item as Testimonial).context === "string" &&
    typeof (item as Testimonial).text === "string" && typeof (item as Testimonial).published === "boolean",
  );
}

function cleanReflections(value: unknown): Reflection[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Reflection =>
    Boolean(item) && typeof item === "object" && typeof (item as Reflection).id === "string" &&
    typeof (item as Reflection).slug === "string" && typeof (item as Reflection).title === "string" &&
    typeof (item as Reflection).excerpt === "string" && typeof (item as Reflection).body === "string" &&
    typeof (item as Reflection).published === "boolean" && typeof (item as Reflection).publishedAt === "string",
  );
}

function cleanStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const list = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return list.length ? list : fallback;
}

function cleanBenefits(value: unknown): Benefit[] {
  if (!Array.isArray(value)) return defaultSiteContent.benefits;
  const list = value.filter(
    (item): item is Benefit => Boolean(item) && typeof item === "object" && typeof (item as Benefit).title === "string" && typeof (item as Benefit).text === "string" && (item as Benefit).title.trim().length > 0 && (item as Benefit).text.trim().length > 0,
  );
  return list.length ? list : defaultSiteContent.benefits;
}
