import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cerebro Clodisnei | Aplicativo pessoal",
  description:
    "Página oficial do Cerebro Clodisnei, sistema pessoal de organização, preservação e recuperação de conhecimento.",
  alternates: { canonical: "/cerebro-clodisnei" },
};

export default function CerebroClodisneiPage() {
  return (
    <main className="legal-page">
      <header className="reflection-nav">
        <Link className="brand" href="/">
          <span className="brand-mark">CP</span>
          <span>
            <strong>Clodisnei C. Peres</strong>
            <small>Autor e criador</small>
          </span>
        </Link>
        <Link href="/">← Voltar ao site</Link>
      </header>

      <article>
        <p className="eyebrow">Aplicativo pessoal</p>
        <h1>Cerebro Clodisnei</h1>
        <p>
          O Cerebro Clodisnei é um sistema pessoal e autoral criado para organizar,
          preservar e recuperar ideias, decisões, obras, pesquisas, documentos e
          outros materiais relacionados ao trabalho intelectual de Clodisnei C. Peres.
        </p>

        <h2>Como funciona</h2>
        <p>
          O sistema recebe entradas autorizadas por canais como Telegram e, em fases
          futuras, poderá receber conteúdos por outras interfaces controladas. O núcleo
          do sistema registra metadados, autoria, relações, versões e rastreabilidade.
          Arquivos pesados e originais são armazenados no Google Drive, enquanto seus
          identificadores e vínculos ficam registrados no banco estruturado do sistema.
        </p>

        <h2>Uso do Google Drive</h2>
        <p>
          Quando o proprietário autoriza o acesso à Conta do Google, o Cerebro Clodisnei
          utiliza a Google Drive API para criar, localizar, ler e preservar arquivos
          necessários ao funcionamento do sistema. Embora a autorização OAuth possa
          conceder acesso ao Google Drive da conta, a aplicação é projetada para operar
          somente dentro da estrutura de pastas destinada ao Cerebro Clodisnei.
        </p>

        <h2>Uso pessoal e controlado</h2>
        <p>
          O aplicativo não é um serviço público aberto. Ele foi criado para uso pessoal
          do proprietário e de eventuais integrações autorizadas por ele. Nenhum agente
          ou ferramenta externa recebe controle direto do Google Drive ou do banco do
          sistema quando a API central pode mediar a operação.
        </p>

        <h2>Privacidade</h2>
        <p>
          As regras de acesso, uso, armazenamento e proteção de dados do Google estão
          descritas na <Link href="/cerebro-clodisnei/privacidade">Política de Privacidade do Cerebro Clodisnei</Link>.
        </p>

        <p className="legal-note">
          O Cerebro Clodisnei está em desenvolvimento por fases. Recursos descritos como
          futuros somente serão disponibilizados após implementação e validação.
        </p>
      </article>
    </main>
  );
}
