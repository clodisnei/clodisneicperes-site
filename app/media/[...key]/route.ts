import { mediaBucket } from "@/lib/media-storage";

export async function GET(
  request: Request,
  context: { params: Promise<{ key: string[] }> },
) {
  try {
    const { key: segments } = await context.params;
    const key = segments.join("/");
    if (!key.startsWith("site-media/")) return new Response("Not found", { status: 404 });

    const requestedRange = request.headers.get("range");
    const object = await mediaBucket().get(key, requestedRange ? { range: request.headers } : undefined);
    if (!object) return new Response("Not found", { status: 404 });

    const headers: Record<string, string> = {
      "content-type": object.httpMetadata?.contentType || "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable",
      "accept-ranges": "bytes",
      ...(object.httpEtag ? { etag: object.httpEtag } : {}),
    };
    if (object.range && object.size) {
      const end = object.range.offset + object.range.length - 1;
      headers["content-range"] = `bytes ${object.range.offset}-${end}/${object.size}`;
      headers["content-length"] = String(object.range.length);
    } else if (object.size) {
      headers["content-length"] = String(object.size);
    }

    return new Response(object.body, {
      status: object.range ? 206 : 200,
      headers,
    });
  } catch {
    return Response.json(
      { error: "O armazenamento de arquivos ainda não está conectado ao site." },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}
