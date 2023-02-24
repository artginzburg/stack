import type { Theme } from './type';

/** Currently only needed to handle generic types. Probably, will do more later. */
export function createTheme<Name extends string>(themeProps: Theme<Name>): Theme<Name> {
  return themeProps;
}
