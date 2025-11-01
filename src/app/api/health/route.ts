export async function GET() {
  return Response.json({ status: "ok", uptimeSec: Math.floor(process.uptime()) });
}
