import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

const MAX_BID = Number(process.env.MAX_BID_AMOUNT ?? 50000);

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const idempotencyKey = request.headers.get("idempotency-key") ?? undefined;

  const body = await request.json().catch(() => ({}));
  const bidderId: string | undefined = body?.bidderId;
  const bidderName: string | undefined = body?.bidderName;
  const bidAmount: number | undefined = body?.bidAmount;

  if (!bidderName || typeof bidAmount !== "number") {
    return Response.json({ error: { code: "INVALID_INPUT", message: "bidderName and bidAmount required" } }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const player = await tx.player.findUnique({ where: { id: params.id } });
      if (!player) throw new Error("NOT_FOUND");

      // Validate auction status/time
      const now = new Date();
      if (player.status !== "active") {
        return { status: 409, code: "CLOSED", payload: { player } } as const;
      }
      if (player.auction_end_time && now >= player.auction_end_time) {
        return { status: 409, code: "CLOSED", payload: { player } } as const;
      }

      // Rules: min increment
      const current = player.current_bid ?? player.base_price;
      const minIncrement = Math.max(Math.ceil(current * 0.1), 100);
      const minAllowed = (player.current_bid ?? player.base_price) + minIncrement;
      if (bidAmount < minAllowed) {
        return { status: 409, code: "TOO_LOW", payload: { minAllowed } } as const;
      }

      if (bidAmount > MAX_BID) {
        return { status: 409, code: "ABOVE_MAX", payload: { max: MAX_BID } } as const;
      }

      if (player.current_bidder_id && bidderId && player.current_bidder_id === bidderId) {
        return { status: 409, code: "SELF_OUTBID", payload: {} } as const;
      }

      // Extend auction if in last 5 minutes
      let newEnd = player.auction_end_time ?? null;
      if (player.auction_end_time) {
        const msLeft = player.auction_end_time.getTime() - now.getTime();
        if (msLeft <= 5 * 60 * 1000) {
          newEnd = new Date(player.auction_end_time.getTime() + 2 * 60 * 1000);
        }
      }

      // Optimistic update: ensure not outbid during process
      const updated = await tx.player.updateMany({
        where: { id: params.id, version: player.version, current_bid: player.current_bid },
        data: {
          current_bid: bidAmount,
          current_bidder_id: bidderId ?? null,
          auction_end_time: newEnd,
          version: { increment: 1 },
          updated_at: now,
        },
      });

      if (updated.count === 0) {
        return { status: 409, code: "OUTBID", payload: {} } as const;
      }

      await tx.bid.create({
        data: {
          player_id: params.id,
          bidder_id: bidderId ?? null,
          bidder_name: bidderName,
          bid_amount: bidAmount,
          ip_address: ip,
        },
      });

      return {
        status: 200,
        code: "ACCEPTED",
        payload: {
          currentBid: bidAmount,
          currentBidder: bidderId ?? null,
          auctionEndTime: newEnd?.toISOString() ?? player.auction_end_time?.toISOString() ?? null,
          version: player.version + 1,
        },
      } as const;
    });

    if (result.status !== 200) {
      return Response.json({ error: { code: result.code, ...result.payload } }, { status: result.status });
    }

    return Response.json(result.payload);
  } catch (e: any) {
    if (e.message === "NOT_FOUND") return Response.json({ error: { code: "NOT_FOUND" } }, { status: 404 });
    return Response.json({ error: { code: "SERVER_ERROR" } }, { status: 500 });
  }
}
