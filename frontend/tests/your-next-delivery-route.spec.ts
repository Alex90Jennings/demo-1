import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/comms/your-next-delivery/[userId]/route";
import { BACKEND_URL } from "@/config/backend.config";

const callRoute = (userId: string) =>
  GET(new Request("http://localhost/api"), { params: Promise.resolve({ userId }) });

describe("GET /api/comms/your-next-delivery/[userId]", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("forwards the backend response and status", async () => {
    const payload = { title: "t", message: "m", totalPrice: 134, freeGift: true };
    const fetchMock = vi.fn().mockResolvedValue(Response.json(payload, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await callRoute("user-1");

    expect(fetchMock).toHaveBeenCalledWith(
      `${BACKEND_URL}/comms/your-next-delivery/user-1`,
      { cache: "no-store" },
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(payload);
  });

  it("passes through a backend 404", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ message: "not found" }, { status: 404 })),
    );

    const res = await callRoute("missing");

    expect(res.status).toBe(404);
  });

  it("returns 502 when the backend is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));

    const res = await callRoute("user-1");

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "ECONNREFUSED" });
  });
});
