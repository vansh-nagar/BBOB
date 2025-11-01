import { prisma } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 100);

  const bids = await prisma.bid.findMany({
    where: { player_id: params.id },
    orderBy: { timestamp: "desc" },
    take: limit,
    select: { id: true, bidder_name: true, bid_amount: true, timestamp: true },
  });

  return Response.json(bids);
}
