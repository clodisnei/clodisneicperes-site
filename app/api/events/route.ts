import { recordSiteEvent } from "@/lib/site-metrics";

const allowedEvents = new Set(["page_view", "plan_click", "book_click", "sample_click", "social_click", "press_click"]);

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { event?: unknown; path?: unknown };
    if (typeof payload.event !== "string" || !allowedEvents.has(payload.event)) {
      return Response.json({ error: "Evento inválido." }, { status: 400 });
    }

    const path = typeof payload.path === "string" && payload.path.startsWith("/")
      ? payload.path.slice(0, 240)
      : "/";
    let referrerHost = "";
    const referrer = request.headers.get("referer");
    if (referrer) {
      try {
        referrerHost = new URL(referrer).hostname.slice(0, 160);
      } catch {
        referrerHost = "";
      }
    }

    await recordSiteEvent(payload.event, path, referrerHost);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Não foi possível registrar o evento." }, { status: 400 });
  }
}
