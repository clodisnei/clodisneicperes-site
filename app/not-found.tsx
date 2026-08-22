import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <Link className="brand" href="/" aria-label="Voltar ao site de Clodisnei C. Peres">
          <span className="brand-mark">CP</span>
          <span><strong>Clodisnei C. Peres</strong><small>Autor e criador</small></span>
        </Link>
        <div>
          <p className="eyebrow">Página não encontrada · erro 404</p>
          <h1>Este caminho não termina aqui.</h1>
          <p>O endereço pode ter mudado ou não existir mais. Escolha um dos caminhos abaixo para continuar.</p>
          <div className="button-row">
            <Link className="button button-dark" href="/">Voltar ao início</Link>
            <Link className="button button-outline" href="/#livro">Conhecer o livro</Link>
            <Link className="button button-outline" href="/#plano">Plano gratuito</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
