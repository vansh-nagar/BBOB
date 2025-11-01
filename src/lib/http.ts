import crypto from "node:crypto";

export function buildEtag(input: string): string {
  return 'W/"' + crypto.createHash("sha1").update(input).digest("hex") + '"';
}

export function notModified(req: Request, etag: string, lastModified?: Date) {
  const inm = req.headers.get("if-none-match");
  const ims = req.headers.get("if-modified-since");
  const etagMatches = inm && inm === etag;
  const lmMatches = lastModified && ims && new Date(ims).getTime() >= lastModified.getTime();
  return Boolean(etagMatches || lmMatches);
}

export function withCacheHeaders(data: unknown, etag: string, lastModified?: Date) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "content-type": "application/json",
      etag,
      "cache-control": "no-store",
      ...(lastModified ? { "last-modified": lastModified.toUTCString() } : {}),
    },
  });
}
