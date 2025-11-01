import { prisma } from "@/lib/db";
import { buildEtag, notModified, withCacheHeaders } from "@/lib/http";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const player = await prisma.player.findUnique({ where: { id: params.id } });
  if (!player) return Response.json({ error: "NOT_FOUND" }, { status: 404 });

  const etag = buildEtag(`${player.id}:${player.version}:${player.updated_at?.toISOString() ?? ""}`);
  if (notModified(request, etag, player.updated_at ?? undefined)) {
    return new Response(null, { status: 304, headers: { etag } });
  }

  return withCacheHeaders(player, etag, player.updated_at ?? undefined);
}
