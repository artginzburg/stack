export function getTileColor(index: number) {
  return getBaseTileColor((index + 1) * 5);
}

export function getBaseTileColor(hue: number) {
  return `hsl(${hue}, 50%, 50%)`;
}
