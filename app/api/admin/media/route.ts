import { getChatGPTUser } from "@/app/chatgpt-auth";
import { isAdministrator } from "@/lib/admin-auth";
import { mediaBucket } from "@/lib/media-storage";

const imageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const videoTypes: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-m4v": "m4v",
};

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Entre na sua conta para continuar." }, { status: 401 });
  if (!isAdministrator(user.email)) return Response.json({ error: "Conta sem permissão administrativa." }, { status: 403 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const kind = formData.get("kind");
    if (!(file instanceof File)) return Response.json({ error: "Selecione um arquivo." }, { status: 400 });
    if (kind !== "cover" && kind !== "author" && kind !== "secondary" && kind !== "journeyCover" && kind !== "videoPoster" && kind !== "video" && kind !== "captions" && kind !== "sample" && kind !== "pressKit") {
      return Response.json({ error: "Tipo de arquivo inválido." }, { status: 400 });
    }

    let extension = "";
    let maximumSize = 8 * 1024 * 1024;
    if (kind === "video") {
      extension = videoTypes[file.type];
      maximumSize = 90 * 1024 * 1024;
      if (!extension) return Response.json({ error: "Use um vídeo MP4, WebM, MOV ou M4V." }, { status: 400 });
    } else if (kind === "captions") {
      const isVtt = file.type === "text/vtt" || file.name.toLowerCase().endsWith(".vtt");
      if (!isVtt) return Response.json({ error: "Use um arquivo de legendas VTT." }, { status: 400 });
      extension = "vtt";
      maximumSize = 1024 * 1024;
    } else if (kind === "sample" || kind === "pressKit") {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) return Response.json({ error: "Use um arquivo PDF para a amostra." }, { status: 400 });
      extension = "pdf";
      maximumSize = 25 * 1024 * 1024;
    } else {
      extension = imageTypes[file.type];
      if (!extension) return Response.json({ error: "Use uma imagem JPG, PNG ou WebP." }, { status: 400 });
    }
    if (file.size > maximumSize) {
      const limit = kind === "video" ? "90 MB" : kind === "captions" ? "1 MB" : kind === "sample" || kind === "pressKit" ? "25 MB" : "8 MB";
      return Response.json({ error: `O arquivo deve ter no máximo ${limit}.` }, { status: 400 });
    }

    const key = `site-media/${kind}-${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const contentType = kind === "captions" ? "text/vtt; charset=utf-8" : kind === "sample" || kind === "pressKit" ? "application/pdf" : file.type;
    await mediaBucket().put(key, await file.arrayBuffer(), { httpMetadata: { contentType } });
    return Response.json({ url: `/media/${key}` });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Não foi possível enviar a imagem." },
      { status: 500 },
    );
  }
}
