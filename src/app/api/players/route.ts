import { prisma } from "@/lib/db";
import { buildEtag, notModified, withCacheHeaders } from "@/lib/http";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;

  const players = await prisma.player.findMany({
    where: status ? { status } : undefined,
    orderBy: [{ status: "asc" }, { auction_end_time: "asc" }, { updated_at: "desc" }],
    select: {
      id: true,
      name: true,
      category: true,
      base_price: true,
      current_bid: true,
      current_bidder_id: true,
      image_url: true,
      description: true,
      status: true,
      auction_start_time: true,
      auction_end_time: true,
      updated_at: true,
      version: true,
    },
  });

  let lastUpdated: Date | undefined = undefined;
  for (const p of players) {
    const u = p.updated_at as Date | null | undefined;
    if (u) {
      if (!lastUpdated || u > lastUpdated) lastUpdated = u;
    }
  }

  const etag = buildEtag(
    JSON.stringify({
      count: players.length,
      maxUpdatedAt: lastUpdated?.toISOString() ?? "none",
      versions: players.map((p) => p.version).join(","),
    })
  );

  if (notModified(request, etag, lastUpdated)) {
    return new Response(null, { status: 304, headers: { etag } });
  }

  return withCacheHeaders(players, etag, lastUpdated);
}
