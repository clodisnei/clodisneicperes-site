import { adminReturnPath, clearAdminSessionCookie } from "@/app/chatgpt-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const returnTo = adminReturnPath(url.searchParams.get("return_to") || "/");
  const response = Response.redirect(new URL(returnTo, request.url), 303);
  response.headers.append("set-cookie", clearAdminSessionCookie());
  return response;
}
