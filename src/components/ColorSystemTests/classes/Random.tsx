export class Random {
  static getFromZeroTo(max: number) {
    return Math.floor(Math.random() * max);
  }

  static getInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
