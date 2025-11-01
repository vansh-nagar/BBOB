import { prisma } from "@/lib/db";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => ({}));
  const optionId: string | undefined = body?.optionId;
  const fingerprint: string | undefined = body?.fingerprint;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!optionId || !fingerprint) {
    return Response.json({ error: { code: "INVALID_INPUT" } }, { status: 400 });
  }

  const today = new Date();
  const resetDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  try {
    await prisma.pollVote.create({
      data: {
        poll_id: params.id,
        option_id: optionId,
        voter_fingerprint: fingerprint,
        voter_ip: ip,
        reset_date: resetDate,
      },
    });
    return Response.json({ accepted: true });
  } catch (e: any) {
    if (e.code === "P2002") {
      return Response.json({ error: { code: "ALREADY_VOTED" } }, { status: 409 });
    }
    return Response.json({ error: { code: "SERVER_ERROR" } }, { status: 500 });
  }
}
