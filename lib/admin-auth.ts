import { env } from "cloudflare:workers";
import type { ChatGPTUser } from "@/app/chatgpt-auth";

export function isAdministrator(email: string): boolean {
  const configured = (env as unknown as { ADMIN_EMAIL?: string }).ADMIN_EMAIL;
  return Boolean(configured && configured.trim().toLowerCase() === email.trim().toLowerCase());
}

export function isAdministratorUser(user: ChatGPTUser): boolean {
  return user.authentication === "password" || isAdministrator(user.email);
}
