import { afterEach, describe, expect, it, vi } from "vitest";
import { FetchError, fetchJSON } from "@/lib/swr-helper";

const rejectionOf = async (promise: Promise<unknown>): Promise<FetchError> => {
  try {
    await promise;
  } catch (err) {
    return err as FetchError;
  }
  throw new Error("Expected promise to reject");
};

describe("fetchJSON", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the parsed body on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ ok: true })));

    await expect(fetchJSON("/api/test")).resolves.toEqual({ ok: true });
  });

  it("throws a FetchError with the status and known error code", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({ statusCode: 404, code: "NO_ACTIVE_SUBSCRIPTIONS" }, { status: 404 }),
      ),
    );

    const err = await rejectionOf(fetchJSON("/api/test"));

    expect(err).toBeInstanceOf(FetchError);
    expect(err.status).toBe(404);
    expect(err.code).toBe("NO_ACTIVE_SUBSCRIPTIONS");
  });

  it("leaves the code undefined for unknown or missing codes", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ code: "SOMETHING_ELSE" }, { status: 500 })),
    );

    const err = await rejectionOf(fetchJSON("/api/test"));

    expect(err.status).toBe(500);
    expect(err.code).toBeUndefined();
  });
});
