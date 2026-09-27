import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/helpers";

describe("formatPrice", () => {
  it.each([
    [134, "£134.00"],
    [197.5, "£197.50"],
    [62.75, "£62.75"],
  ])("formats %d as %s", (amount, expected) => {
    expect(formatPrice(amount)).toBe(expected);
  });
});
