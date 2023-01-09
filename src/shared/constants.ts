/** Values that are not yet clearly explained in the code or the ReadMe, that were obtained via trial and error. */
export const magicValues = {
  /** Makes the point of view exactly match the original game. */
  pointOfViewFix: 100,
} as const;

/** @todo rename to tileConfig? Then add size. */
export const config = {
  tileHeight: 17, // should be 17 to match the original. Was 10 in the first version if this remake.
} as const;
