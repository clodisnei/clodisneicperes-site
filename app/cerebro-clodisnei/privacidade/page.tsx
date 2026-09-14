import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Política de Privacidade | Cerebro Clodisnei",
  description:
    "Saiba como o Cerebro Clodisnei acessa, utiliza, armazena e protege dados da Conta do Google e arquivos do Google Drive.",
  alternates: { canonical: "/cerebro-clodisnei/privacidade" },
};

export default async function CerebroPrivacyPage() {
  const content = await getSiteContent();

  return (
    <main className="legal-page">
      <header className="reflection-nav">
        <Link className="brand" href="/cerebro-clodisnei">
          <span className="brand-mark">CP</span>
          <span>
            <strong>Cerebro Clodisnei</strong>
            <small>Aplicativo pessoal</small>
          </span>
        </Link>
        <Link href="/cerebro-clodisnei">← Voltar ao aplicativo</Link>
      </header>

      <article>
        <p className="eyebrow">Privacidade e dados do Google</p>
        <h1>Política de Privacidade do Cerebro Clodisnei</h1>
        <p className="legal-updated">Última atualização: 14 de setembro de 2026.</p>

        <h2>1. Finalidade do aplicativo</h2>
        <p>
          O Cerebro Clodisnei é um sistema pessoal e autoral destinado a organizar,
          preservar e recuperar ideias, decisões, obras, pesquisas, documentos e outros
          materiais relacionados ao trabalho intelectual de seu proprietário.
        </p>

        <h2>2. Dados do Google acessados</h2>
        <p>
          Quando o proprietário autoriza a integração com a Conta do Google, o aplicativo
          utiliza a Google Drive API para acessar arquivos e pastas necessários ao seu
          funcionamento. As operações podem incluir criação, leitura, localização,
          atualização e preservação de arquivos dentro da estrutura destinada ao Cerebro
          Clodisnei.
        </p>
        <p>
          A autorização OAuth utilizada pela aplicação pode tecnicamente conceder acesso
          mais amplo ao Google Drive da conta. Mesmo assim, a aplicação é projetada para
          limitar suas operações à pasta raiz do Cerebro Clodisnei e às subpastas
          autorizadas pelo próprio sistema.
        </p>

        <h2>3. Como os dados são utilizados</h2>
        <p>
          Os dados do Google são utilizados exclusivamente para permitir que o aplicativo
          armazene, recupere, relacione e preserve arquivos necessários ao funcionamento do
          Cerebro Clodisnei. Os identificadores dos arquivos, links controlados, tipo,
          tamanho, versão, função e demais metadados necessários podem ser registrados no
          banco estruturado do sistema para manter rastreabilidade e permitir localizar o
          original no Google Drive.
        </p>

        <h2>4. Armazenamento</h2>
        <p>
          Arquivos pesados e originais permanecem no Google Drive. O banco estruturado do
          Cerebro Clodisnei armazena principalmente metadados, vínculos, estados,
          relações, autoria, versões e referências aos arquivos. Credenciais OAuth,
          segredos e tokens de longa duração não são publicados no código-fonte e devem
          permanecer armazenados como segredos de infraestrutura.
        </p>

        <h2>5. Compartilhamento de dados</h2>
        <p>
          O Cerebro Clodisnei não vende dados do usuário. Dados do Google não são usados
          para publicidade e não são compartilhados com terceiros para fins comerciais.
          Integrações autorizadas podem receber apenas o contexto e as permissões
          necessários para executar uma função específica, sempre mediadas pelas regras do
          sistema quando tecnicamente possível.
        </p>

        <h2>6. Uso limitado dos dados do Google</h2>
        <p>
          O uso de informações recebidas das APIs do Google é limitado às funcionalidades
          declaradas nesta política e à operação do Cerebro Clodisnei. O aplicativo não
          utiliza dados do Google para criar perfis de publicidade, vender informações ou
          permitir vigilância de usuários.
        </p>

        <h2>7. Retenção e exclusão</h2>
        <p>
          Arquivos e registros podem ser preservados enquanto forem necessários para a
          memória, rastreabilidade, histórico ou operação do sistema. Quando uma exclusão
          for solicitada e for compatível com as regras de preservação e auditoria do
          Cérebro, o proprietário poderá remover ou revogar os dados e o acesso
          correspondente. O acesso do aplicativo à Conta do Google também pode ser revogado
          diretamente nas configurações de segurança da própria Conta do Google.
        </p>

        <h2>8. Segurança</h2>
        <p>
          O sistema adota autenticação, separação entre ambientes, armazenamento de
          segredos fora do repositório público, rastreabilidade e princípio de menor acesso
          possível dentro da arquitetura aprovada. Nenhum sistema conectado é tratado como
          fonte autônoma da verdade sem validação pelas regras centrais do Cerebro Clodisnei.
        </p>

        <h2>9. Alterações desta política</h2>
        <p>
          Esta política pode ser atualizada quando o aplicativo receber novas integrações
          ou quando houver mudanças relevantes no tratamento de dados. A data da última
          atualização será sempre exibida nesta página.
        </p>

        <h2>10. Contato</h2>
        <p>
          {content.contactEmail ? (
            <>
              Para dúvidas sobre privacidade, dados ou revogação de acesso, escreva para{' '}
              <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>.
            </>
          ) : (
            <>
              Para dúvidas sobre privacidade, dados ou revogação de acesso, utilize um dos
              canais oficiais publicados na seção de contato do site de Clodisnei C. Peres.
            </>
          )}
        </p>

        <p className="legal-note">
          Esta política se aplica à integração do Cerebro Clodisnei com serviços do Google
          e complementa a política geral de privacidade do site.
        </p>
      </article>
    </main>
  );
}
