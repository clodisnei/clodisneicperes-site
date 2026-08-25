import { requireChatGPTUser } from "@/app/chatgpt-auth";
import Link from "next/link";
import { isAdministratorUser } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/site-content";
import DraftPreview from "./DraftPreview";

export const dynamic = "force-dynamic";

export default async function AdminPreviewPage() {
  const user = await requireChatGPTUser("/admin/preview");
  if (!isAdministratorUser(user)) {
    return <main className="admin-shell"><section className="admin-access-card"><h1>Acesso não autorizado.</h1><Link className="button button-dark" href="/">Voltar ao site</Link></section></main>;
  }
  return <DraftPreview fallback={await getSiteContent()} />;
}
