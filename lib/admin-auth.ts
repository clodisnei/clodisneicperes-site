import { env } from "cloudflare:workers";

export function isAdministrator(email: string): boolean {
  const configured = (env as unknown as { ADMIN_EMAIL?: string }).ADMIN_EMAIL;
  return Boolean(configured && configured.trim().toLowerCase() === email.trim().toLowerCase());
}
