export {};
// type ColorSystemTile = {
//   tileColor: string; // default hsl
//   differenceFromPreviousTileColor: string; // custom hsl (10, +5%, -5%)
// };
// class ColorSystem {
//   tiles: ColorSystemTile[] = [];

//   constructor() {
//     const firstColor = getRandomColor();
//     const firstDifference = 'hsl(10, +5%, -5%)';

//     this.tiles.push({ tileColor: firstColor, differenceFromPreviousTileColor: firstDifference });
//   }

//   addNewTile(): void {
//     const lastTile = this.tiles.at(-1)!;

//     const hasColorReachedLimit = this.getIsColorTooBrightOrTooDark(
//       lastTile.differenceFromPreviousTileColor,
//     );

//     let newTile: ColorSystemTile;
//     if (hasColorReachedLimit) {
//       const newDifference = this.getNewDifferenceThatWillNotMakeColorBrighterOrDarker(
//         lastTile.tileColor,
//         hasColorReachedLimit,
//       );

//       newTile = {
//         tileColor: mixColorWithDifference(lastTile.tileColor, newDifference),
//         differenceFromPreviousTileColor: newDifference,
//       };
//     } else {
//       newTile = {
//         tileColor: mixColorWithDifference(
//           lastTile.tileColor,
//           lastTile.differenceFromPreviousTileColor,
//         ),
//         differenceFromPreviousTileColor: lastTile.differenceFromPreviousTileColor,
//       };
//     }

//     this.tiles.push(newTile);
//   }

//   getNewDifferenceThatWillNotMakeColorBrighterOrDarker(
//     tileColor: string,
//     tooBrightOrTooDark: { isTooBright: boolean; isTooDark: boolean },
//   ): string {
//     // manipulate the tileColor, and return a new color, but if the color is already too dark — don't make it darker, and if it's too light — don't make it lighter.

//     return '';
//   }

//   getIsColorTooBrightOrTooDark(tileColor: string) {
//     const onlyValues = tileColor.slice(4, -1);
//     const splitted = onlyValues.split(',').map((value) => value.trim());
//     const lightness = Number(splitted.at(-1)!);

//     const isTooDark = lightness < 0.2;
//     const isTooBright = lightness > 0.8;

//     if (isTooDark || isTooBright) {
//       return { isTooBright, isTooDark };
//     } else {
//       return undefined;
//     }
//   }
// }
