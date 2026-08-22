import { chatGPTSignOutPath, requireChatGPTUser } from "@/app/chatgpt-auth";
import { isAdministrator } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/site-content";
import { getAdminDashboard } from "@/lib/site-metrics";
import AdminEditor from "./AdminEditor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");

  if (!isAdministrator(user.email)) {
    return (
      <main className="admin-shell">
        <section className="admin-access-card">
          <p className="eyebrow">Acesso reservado</p>
          <h1>Esta conta não tem permissão para editar o site.</h1>
          <p>Entre com a conta administrativa de Clodisnei Cavalcante Peres.</p>
          <a className="button button-dark" href={chatGPTSignOutPath("/admin")}>Trocar de conta</a>
        </section>
      </main>
    );
  }

  const [content, dashboard] = await Promise.all([getSiteContent(), getAdminDashboard()]);

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Painel administrativo</p>
          <h1>Conteúdo do site</h1>
          <p>Edite, pré-visualize e publique as informações. O acesso permanece protegido pela sua conta autorizada.</p>
        </div>
        <div className="admin-account">
          <span>{user.displayName}</span>
          <a href="/" target="_blank">Ver site</a>
          <a href={chatGPTSignOutPath("/")}>Sair</a>
        </div>
      </header>
      <section className="admin-dashboard" aria-labelledby="dashboard-title">
        <div className="admin-dashboard-heading">
          <div>
            <p className="eyebrow">Visão geral</p>
            <h2 id="dashboard-title">Resultados do site</h2>
          </div>
          <small>Contagem simples e respeitosa: sem cookies, IP ou identificação de visitantes.</small>
        </div>
        <div className="metric-grid">
          <article><strong>{dashboard.totalViews}</strong><span>visualizações</span></article>
          <article><strong>{dashboard.last30Views}</strong><span>nos últimos 30 dias</span></article>
          <article><strong>{dashboard.planClicks}</strong><span>cliques no plano</span></article>
          <article><strong>{dashboard.bookClicks}</strong><span>cliques para comprar</span></article>
          <article><strong>{dashboard.sampleClicks}</strong><span>amostras abertas</span></article>
          <article><strong>{dashboard.socialClicks}</strong><span>cliques nas redes</span></article>
          <article><strong>{dashboard.pressClicks}</strong><span>kits de imprensa</span></article>
          <article><strong>{dashboard.newsletterCount}</strong><span>assinantes de novidades</span></article>
        </div>
        <div className="waitlist-dashboard">
          <div>
            <strong>{dashboard.waitlistCount}</strong>
            <span>pessoas interessadas na Jornada</span>
            <a href="/api/admin/waitlist.csv">Baixar lista em CSV</a>
          </div>
          <div>
            <h3>Cadastros recentes</h3>
            {dashboard.recentWaitlist.length ? (
              <ul>{dashboard.recentWaitlist.map((item) => <li key={`${item.email}-${item.created_at}`}><span>{item.email}</span><small>{new Date(`${item.created_at}Z`).toLocaleDateString("pt-BR")}</small></li>)}</ul>
            ) : <p>Nenhum cadastro até o momento.</p>}
          </div>
        </div>
        <div className="waitlist-dashboard">
          <div>
            <strong>{dashboard.newsletterCount}</strong>
            <span>pessoas inscritas nas novidades gerais</span>
            <a href="/api/admin/newsletter.csv">Baixar lista em CSV</a>
          </div>
          <div>
            <h3>Assinantes recentes</h3>
            {dashboard.recentNewsletter.length ? (
              <ul>{dashboard.recentNewsletter.map((item) => <li key={`${item.email}-${item.created_at}`}><span>{item.email}</span><small>{new Date(`${item.created_at}Z`).toLocaleDateString("pt-BR")}</small></li>)}</ul>
            ) : <p>Nenhum cadastro até o momento.</p>}
          </div>
        </div>
      </section>
      <AdminEditor initialContent={content} />
    </main>
  );
}
