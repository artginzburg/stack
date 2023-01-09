function easeOutCirc(x: number): number {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

export function easeInOutSineEaseOutCirc(x: number) {
  return easeInOutSine(easeOutCirc(x));
}
