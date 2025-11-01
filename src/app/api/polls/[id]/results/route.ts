import { prisma } from "@/lib/db";

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const today = new Date();
  const resetDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  const poll = await prisma.poll.findUnique({ where: { id } });
  if (!poll) return Response.json({ error: { code: "NOT_FOUND" } }, { status: 404 });

  const grouped = await prisma.pollVote.groupBy({
    by: ["option_id"],
    where: { poll_id: id, reset_date: resetDate },
    _count: { option_id: true },
  });
  const totalVotes = grouped.reduce((a: number, g: { _count: { option_id: number | null } }) => a + (g._count.option_id ?? 0), 0);

  const options = (poll.options as unknown as Array<{ id: string; text: string; members?: string; teamName?: string; tagline?: string }>) || [];
  const withCounts = options.map((o: { id: string; text: string; members?: string; teamName?: string; tagline?: string }) => {
    const row = grouped.find((g: { option_id: string; _count: { option_id: number | null } }) => g.option_id === o.id);
    const votes = row?._count.option_id ?? 0;
    return { ...o, votes, percent: totalVotes ? Math.round((votes / totalVotes) * 100) : 0 };
  });

  return Response.json({ options: withCounts, totalVotes });
}
