import application from "../dist/server/index.js";

interface PagesEnvironment {
  ASSETS: Fetcher;
}

interface PagesExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const STATIC_PATH_PREFIXES = ["/assets/"];
const STATIC_FILE_PATTERN =
  /\.(?:avif|css|gif|ico|jpe?g|js|json|map|png|svg|webmanifest|webp|woff2?)$/i;

function isStaticAsset(request: Request): boolean {
  if (request.method !== "GET" && request.method !== "HEAD") return false;

  const { pathname } = new URL(request.url);
  return (
    STATIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    STATIC_FILE_PATTERN.test(pathname)
  );
}

export default {
  async fetch(
    request: Request,
    env: PagesEnvironment,
    ctx: PagesExecutionContext,
  ): Promise<Response> {
    if (isStaticAsset(request)) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) return assetResponse;
    }

    return application.fetch(request, env, ctx);
  },
};
