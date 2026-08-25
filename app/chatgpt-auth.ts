import { env } from "cloudflare:workers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type ChatGPTUser = {
  displayName: string;
  email: string;
  fullName: string | null;
  authentication: "chatgpt" | "password";
};

const USER_EMAIL_HEADER = "oai-authenticated-user-email";
const USER_FULL_NAME_HEADER = "oai-authenticated-user-full-name";
const USER_FULL_NAME_ENCODING_HEADER =
  "oai-authenticated-user-full-name-encoding";
const PERCENT_ENCODED_UTF8 = "percent-encoded-utf-8";
const SIGN_IN_PATH = "/signin-with-chatgpt";
const SIGN_OUT_PATH = "/signout-with-chatgpt";
const CALLBACK_PATH = "/callback";
export const ADMIN_SESSION_COOKIE = "clodisnei_admin_session";
const ADMIN_SESSION_SECONDS = 60 * 60 * 24 * 30;

type AdminRuntime = {
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
};

function runtime(): AdminRuntime {
  return env as unknown as AdminRuntime;
}

export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  const requestHeaders = await headers();
  const email = requestHeaders.get(USER_EMAIL_HEADER);
  const host = (requestHeaders.get("host") || "").split(":")[0].toLowerCase();
  if (email && host.endsWith(".chatgpt.site")) {
    const encodedFullName = requestHeaders.get(USER_FULL_NAME_HEADER);
    const fullName =
      encodedFullName &&
      requestHeaders.get(USER_FULL_NAME_ENCODING_HEADER) === PERCENT_ENCODED_UTF8
        ? safeDecodeURIComponent(encodedFullName)
        : null;

    return {
      displayName: fullName ?? email,
      email,
      fullName,
      authentication: "chatgpt",
    };
  }

  if (await verifyAdminSession(requestHeaders.get("cookie"))) {
    const configuredEmail = runtime().ADMIN_EMAIL?.trim() || "administrador";
    return {
      displayName: "Administrador",
      email: configuredEmail,
      fullName: null,
      authentication: "password",
    };
  }

  return null;
}

export async function requireChatGPTUser(
  returnTo: string,
): Promise<ChatGPTUser> {
  const user = await getChatGPTUser();
  if (user) return user;

  redirect(chatGPTSignInPath(returnTo));
}

export function chatGPTSignInPath(returnTo: string): string {
  const safeReturnTo = safeRelativeReturnPath(returnTo);
  return `/admin/entrar?return_to=${encodeURIComponent(safeReturnTo)}`;
}

export function chatGPTSignOutPath(returnTo = "/"): string {
  const safeReturnTo = safeRelativeReturnPath(returnTo);
  return `/api/admin/logout?return_to=${encodeURIComponent(safeReturnTo)}`;
}

export function adminReturnPath(value: string | null): string {
  return safeRelativeReturnPath(value || "/admin");
}

export function adminPasswordConfigured(): boolean {
  return Boolean(runtime().ADMIN_PASSWORD?.trim());
}

export async function validateAdminPassword(candidate: string): Promise<boolean> {
  const configured = runtime().ADMIN_PASSWORD?.trim();
  if (!configured || !candidate) return false;
  const [expected, received] = await Promise.all([
    signValue("credential-check", configured),
    signValue("credential-check", candidate),
  ]);
  return constantTimeEqual(expected, received);
}

export async function createAdminSessionToken(): Promise<string> {
  const secret = runtime().ADMIN_PASSWORD?.trim();
  if (!secret) throw new Error("A senha administrativa ainda não foi configurada.");
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS;
  const payload = `v1.${expiresAt}`;
  return `${payload}.${await signValue(payload, secret)}`;
}

export function adminSessionCookie(token: string): string {
  return `${ADMIN_SESSION_COOKIE}=${token}; Path=/; Max-Age=${ADMIN_SESSION_SECONDS}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearAdminSessionCookie(): string {
  return `${ADMIN_SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

async function verifyAdminSession(cookieHeader: string | null): Promise<boolean> {
  const secret = runtime().ADMIN_PASSWORD?.trim();
  if (!secret || !cookieHeader) return false;
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.slice(ADMIN_SESSION_COOKIE.length + 1);
  if (!token) return false;

  const [version, expiresText, signature] = token.split(".");
  const expiresAt = Number(expiresText);
  if (version !== "v1" || !Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000) || !signature) return false;
  const expected = await signValue(`${version}.${expiresText}`, secret);
  return constantTimeEqual(expected, signature);
}

async function signValue(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
  return Array.from(signature, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
}

function safeRelativeReturnPath(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) return "/";

  let url: URL;
  try {
    url = new URL(value, "https://app.local");
  } catch {
    return "/";
  }
  if (url.origin !== "https://app.local") return "/";
  if (isReservedAuthPath(url.pathname)) return "/";

  return `${url.pathname}${url.search}${url.hash}`;
}

function isReservedAuthPath(pathname: string): boolean {
  return (
    pathname === SIGN_IN_PATH ||
    pathname === SIGN_OUT_PATH ||
    pathname === CALLBACK_PATH
  );
}

function safeDecodeURIComponent(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}
