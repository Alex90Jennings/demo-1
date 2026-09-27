const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

export function formatPrice(amount: number): string {
  return gbp.format(amount);
}
