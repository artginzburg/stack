export function round(value: number, precision: number = 1): number {
  const multiplier = 10 ** (precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
