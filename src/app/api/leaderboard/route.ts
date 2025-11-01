import { prisma } from "@/lib/db";

export async function GET() {
  const grouped = await prisma.bid.groupBy({
    by: ["bidder_id", "bidder_name"],
    _sum: { bid_amount: true },
    _count: { _all: true },
    orderBy: { _sum: { bid_amount: "desc" } },
  });

  const data = grouped.map((g: {
    bidder_id: string | null;
    bidder_name: string | null;
    _sum: { bid_amount: number | null };
    _count: { _all: number };
  }) => ({
    bidderId: g.bidder_id,
    bidderName: g.bidder_name,
    totalAmount: g._sum.bid_amount ?? 0,
    bids: g._count._all,
  }));

  return Response.json(data);
}
