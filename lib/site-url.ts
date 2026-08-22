import { env } from "cloudflare:workers";

const fallbackSiteUrl = "https://clodisnei-peres.clodisneicp.chatgpt.site";

export const siteUrl = ((env as unknown as { PUBLIC_SITE_URL?: string }).PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, "");
