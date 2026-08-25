import { adminReturnPath, clearAdminSessionCookie } from "@/app/chatgpt-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const returnTo = adminReturnPath(url.searchParams.get("return_to") || "/");
  return new Response(null, {
    status: 303,
    headers: {
      location: new URL(returnTo, request.url).toString(),
      "set-cookie": clearAdminSessionCookie(),
    },
  });
}
