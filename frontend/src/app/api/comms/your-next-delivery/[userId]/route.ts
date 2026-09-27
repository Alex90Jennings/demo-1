import { BACKEND_URL } from "@/config/backend.config";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const res = await fetch(
      `${BACKEND_URL}/comms/your-next-delivery/${encodeURIComponent(userId)}`,
      { cache: "no-store" },
    );
    const body = await res.json().catch(() => null);
    return Response.json(body ?? { error: "Invalid response from backend" }, {
      status: res.status,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return Response.json({ error: msg }, { status: 502 });
  }
}
