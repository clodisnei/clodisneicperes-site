import { getChatGPTUser } from "@/app/chatgpt-auth";
import { isAdministrator } from "@/lib/admin-auth";
import { listWaitlist } from "@/lib/site-metrics";

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Entre na sua conta para continuar." }, { status: 401 });
  if (!isAdministrator(user.email)) return Response.json({ error: "Conta sem permissão administrativa." }, { status: 403 });

  const rows = await listWaitlist();
  const csv = [
    "email,data_de_cadastro",
    ...rows.map((row) => `${csvCell(row.email)},${csvCell(row.created_at)}`),
  ].join("\n");

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=interessados-jornada.csv",
    },
  });
}
