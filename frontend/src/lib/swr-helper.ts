import type { CommsErrorCode } from "@/types";

const COMMS_ERROR_CODES: readonly CommsErrorCode[] = ["USER_NOT_FOUND", "NO_ACTIVE_SUBSCRIPTIONS"];

export class FetchError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: CommsErrorCode,
  ) {
    super(message);
  }
}

function readErrorCode(body: unknown): CommsErrorCode | undefined {
  if (typeof body !== "object" || body === null || !("code" in body)) return undefined;
  const { code } = body;
  return COMMS_ERROR_CODES.find((known) => known === code);
}

export const fetchJSON = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const body: unknown = await res.json().catch(() => null);
    throw new FetchError(`Request failed (${res.status})`, res.status, readErrorCode(body));
  }
  return (await res.json()) as T;
};
