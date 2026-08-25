import {
  adminReturnPath,
  adminSessionCookie,
  createAdminSessionToken,
  validateAdminPassword,
} from "@/app/chatgpt-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");
  const returnTo = adminReturnPath(String(formData.get("return_to") || "/admin"));

  if (!(await validateAdminPassword(password))) {
    const failed = new URL("/admin/entrar", request.url);
    failed.searchParams.set("erro", "1");
    failed.searchParams.set("return_to", returnTo);
    return Response.redirect(failed, 303);
  }

  const response = Response.redirect(new URL(returnTo, request.url), 303);
  response.headers.append("set-cookie", adminSessionCookie(await createAdminSessionToken()));
  return response;
}
