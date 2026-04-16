export function formatAmount(amount: number) {
  if (amount >= 100_000_000) {
    const value = amount / 100_000_000;
    const formatted = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);

    return `${formatted}억`;
  }

  return `${Math.round(amount / 10_000).toLocaleString("ko-KR")}만`;
}
