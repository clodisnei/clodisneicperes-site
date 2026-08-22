import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Política de Privacidade | Clodisnei C. Peres",
  description: "Saiba como os dados enviados neste site são utilizados e protegidos.",
  alternates: { canonical: "/privacidade" },
};

export default async function PrivacyPage() {
  const content = await getSiteContent();
  return (
    <main className="legal-page">
      <header className="reflection-nav">
        <Link className="brand" href="/"><span className="brand-mark">CP</span><span><strong>Clodisnei C. Peres</strong><small>Autor e criador</small></span></Link>
        <Link href="/">← Voltar ao site</Link>
      </header>
      <article>
        <p className="eyebrow">Transparência e cuidado</p>
        <h1>Política de Privacidade</h1>
        <p className="legal-updated">Última atualização: 20 de agosto de 2026.</p>
        <h2>Quais informações são coletadas</h2>
        <p>Quando você solicita novidades gerais ou informações sobre a Jornada, armazenamos o endereço de e-mail informado e a data do cadastro. As duas listas são mantidas separadamente. Também contamos visualizações de páginas e cliques em botões para compreender quais conteúdos são mais úteis.</p>
        <h2>O que não fazemos</h2>
        <p>A medição interna não utiliza cookies de publicidade, não grava seu endereço IP e não cria um perfil individual de navegação. Seus dados não são vendidos.</p>
        <h2>Como as informações são utilizadas</h2>
        <p>O e-mail é utilizado somente para a finalidade escolhida no momento do cadastro: novidades gerais do autor ou informações sobre a Jornada. As contagens de uso ajudam a melhorar o conteúdo e a organização do site.</p>
        <h2>Seus direitos</h2>
        <p>Você pode solicitar confirmação, correção ou exclusão do seu cadastro e pode deixar de receber comunicações a qualquer momento.</p>
        <h2>Contato</h2>
        <p>{content.contactEmail ? <>Para tratar de privacidade ou solicitar a exclusão dos seus dados, escreva para <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>.</> : <>Para tratar de privacidade ou solicitar a exclusão dos seus dados, utilize um dos canais oficiais publicados na seção de contato do site.</>}</p>
        <p className="legal-note">Este site apresenta conteúdos educativos e reflexivos. Eles não substituem acompanhamento médico, psicológico ou terapêutico.</p>
      </article>
    </main>
  );
}
