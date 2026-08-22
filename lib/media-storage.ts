import { env } from "cloudflare:workers";

type StoredObject = {
  body: ReadableStream;
  httpMetadata?: { contentType?: string };
  httpEtag?: string;
  size?: number;
  range?: { offset: number; length: number };
};

type Bucket = {
  put: (key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }) => Promise<unknown>;
  get: (key: string, options?: { range?: Headers }) => Promise<StoredObject | null>;
};

export function mediaBucket(): Bucket {
  const bucket = (env as unknown as { BUCKET?: Bucket }).BUCKET;
  if (!bucket) throw new Error("O armazenamento de imagens ainda não está disponível.");
  return bucket;
}
