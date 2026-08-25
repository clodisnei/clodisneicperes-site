import { getChatGPTUser } from "@/app/chatgpt-auth";
import { isAdministratorUser } from "@/lib/admin-auth";
import { listNewsletter } from "@/lib/site-metrics";

function csvCell(value: string): string { return `"${value.replaceAll('"', '""')}"`; }

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Entre na sua conta para continuar." }, { status: 401 });
  if (!isAdministratorUser(user)) return Response.json({ error: "Conta sem permissão administrativa." }, { status: 403 });
  const rows = await listNewsletter();
  const csv = ["email,data_de_cadastro", ...rows.map((row) => `${csvCell(row.email)},${csvCell(row.created_at)}`)].join("\n");
  return new Response(`\uFEFF${csv}`, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=assinantes-novidades.csv" } });
}
