import { adminPasswordConfigured, adminReturnPath } from "@/app/chatgpt-auth";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ erro?: string; return_to?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const returnTo = adminReturnPath(params.return_to || "/admin");
  const configured = adminPasswordConfigured();

  return (
    <main className="admin-shell">
      <section className="admin-access-card">
        <p className="eyebrow">Área administrativa</p>
        <h1>Entrar no painel oficial</h1>
        {!configured ? (
          <p>A senha administrativa ainda precisa ser configurada no Cloudflare.</p>
        ) : (
          <form action="/api/admin/login" method="post">
            <input type="hidden" name="return_to" value={returnTo} />
            <label>
              Senha administrativa
              <input name="password" type="password" autoComplete="current-password" required autoFocus />
            </label>
            {params.erro === "1" && <p className="save-message error" role="alert">Senha incorreta. Tente novamente.</p>}
            <button className="button button-dark" type="submit">Entrar</button>
          </form>
        )}
        <a href="/">Voltar ao site</a>
      </section>
    </main>
  );
}
