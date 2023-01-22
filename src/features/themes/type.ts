export type Theme<Name extends string = string> = {
  name: Name;
  background: (index: number) => string;
  /** The color of the UI elements, and the Perfect Effects. */
  lightElements: string;
  /** @param index the score at the moment of tile creation minus one. (from `-1` to `Infinity`) */
  tile: (index: number) => string;
};
