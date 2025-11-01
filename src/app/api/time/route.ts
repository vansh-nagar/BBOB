export async function GET() {
  return Response.json({ serverTime: new Date().toISOString() });
}
