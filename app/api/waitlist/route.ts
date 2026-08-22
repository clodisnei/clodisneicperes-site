import { joinJourneyWaitlist } from "@/lib/site-metrics";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get("content-length") || 0) > 4096) return Response.json({ error: "Solicitação inválida." }, { status: 413 });
    const payload = (await request.json()) as { email?: unknown; consent?: unknown; website?: unknown; startedAt?: unknown };
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

    if (typeof payload.website === "string" && payload.website.trim()) {
      return Response.json({ ok: true });
    }
    const elapsed = Date.now() - Number(payload.startedAt);
    if (!Number.isFinite(elapsed) || elapsed < 800 || elapsed > 6 * 60 * 60 * 1000) return Response.json({ error: "Atualize a página e tente novamente." }, { status: 400 });

    if (!emailPattern.test(email) || email.length > 254) {
      return Response.json({ error: "Digite um e-mail válido." }, { status: 400 });
    }
    if (payload.consent !== true) {
      return Response.json({ error: "Confirme que deseja receber novidades da Jornada." }, { status: 400 });
    }

    await joinJourneyWaitlist(email);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Não foi possível fazer seu cadastro." },
      { status: 500 },
    );
  }
}
