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

  difference(target: HSLColor) {
    this.h = target.h - this.h;
    this.s = target.s - this.s;
    this.l = target.l - this.l;

    return this;
  }

  divScalar(num: number) {
    this.h /= num;
    this.s /= num;
    this.l /= num;

    return this;
  }

  equals(match: HSLColor) {
    return this.toString() === match.toString();
  }

  round() {
    this.h = Math.round(this.h);
    this.s = Math.round(this.s);
    this.l = Math.round(this.l);

    return this;
  }

  static getRandom() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 100);
    const lightness = Math.floor(Math.random() * 100);
    return new HSLColor(hue, saturation, lightness);
  }
}
