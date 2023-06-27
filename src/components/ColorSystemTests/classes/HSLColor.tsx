export class HSLColor {
  constructor(public h: number, public s: number, public l: number) {}

  toString() {
    return `hsl(${this.h}, ${this.s}%, ${this.l}%)` as const;
  }

  clone() {
    return new HSLColor(this.h, this.s, this.l);
  }

  add(applier: HSLColor) {
    this.h += applier.h;
    this.s += applier.s;
    this.l += applier.l;

    return this;
  }

  static getRandom() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 100);
    const lightness = Math.floor(Math.random() * 100);
    return new HSLColor(hue, saturation, lightness);
  }
}
