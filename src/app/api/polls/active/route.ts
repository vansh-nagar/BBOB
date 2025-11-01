import { prisma } from "@/lib/db";

export async function GET() {
  // Active poll = latest created for today reset_date
  const today = new Date();
  const dateOnly = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const poll = await prisma.poll.findFirst({
    where: { reset_date: dateOnly },
    orderBy: { created_at: "desc" },
  });
  if (!poll) return Response.json({});
  return Response.json(poll);
}
