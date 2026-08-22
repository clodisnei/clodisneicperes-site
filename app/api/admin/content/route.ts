import { getChatGPTUser } from "@/app/chatgpt-auth";
import { isAdministrator } from "@/lib/admin-auth";
import { mergeSiteContent, saveSiteContent, type SiteContent } from "@/lib/site-content";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Entre na sua conta para continuar." }, { status: 401 });
  if (!isAdministrator(user.email)) return Response.json({ error: "Conta sem permissão administrativa." }, { status: 403 });

  try {
    const payload = (await request.json()) as Partial<SiteContent>;
    const content = mergeSiteContent(payload);
    await saveSiteContent(content);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Não foi possível salvar o conteúdo." },
      { status: 500 },
    );
  }
}
