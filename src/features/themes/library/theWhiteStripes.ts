import { createTheme } from '../utils';

const palette = ['#eee', '#af0101'];

export const themeTheWhiteStripes = createTheme({
  name: 'The White Stripes',
  background: () => '#fff',
  lightElements: '#111',
  tile: (index) => palette[(index + 1) % palette.length],
});
