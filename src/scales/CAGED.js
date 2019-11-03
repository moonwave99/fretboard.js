import { generateBox } from './generator';

const patterns = [
  {
    name: 'E',
    patternRoot: 'E2',
    pattern: [
      { string: 6, fret: -1 },
      { string: 6, fret: 0, root: true },
      { string: 6, fret: 2 },
      { string: 5, fret: -1 },
      { string: 5, fret: 0 },
      { string: 5, fret: 2 },
      { string: 4, fret: -1 },
      { string: 4, fret: 1 },
      { string: 4, fret: 2 },
      { string: 3, fret: -1 },
      { string: 3, fret: 1 },
      { string: 3, fret: 2 },
      { string: 2, fret: 0 },
      { string: 2, fret: 2 },
      { string: 1, fret: -1 },
      { string: 1, fret: 0 },
      { string: 1, fret: 2 }
    ]
  },
  {
    name: 'D',
    patternRoot: 'D3',
    pattern: [
      { string: 6, fret: 0 },
      { string: 6, fret: 2 },
      { string: 6, fret: 3 },
      { string: 5, fret: 0 },
      { string: 5, fret: 2 },
      { string: 4, fret: -1 },
      { string: 4, fret: 0, root: true },
      { string: 4, fret: 2 },
      { string: 3, fret: -1 },
      { string: 3, fret: 0 },
      { string: 3, fret: 2 },
      { string: 2, fret: 0 },
      { string: 2, fret: 2 },
      { string: 2, fret: 3 },
      { string: 1, fret: 0 },
      { string: 1, fret: 2 },
      { string: 1, fret: 3 }
    ]
  },
  {
    name: 'C',
    patternRoot: 'C3',
    pattern: [
      { string: 6, fret: 0 },
      { string: 6, fret: 1 },
      { string: 6, fret: 3 },
      { string: 5, fret: 0 },
      { string: 5, fret: 2 },
      { string: 5, fret: 3, root: true },
      { string: 4, fret: 0 },
      { string: 4, fret: 2 },
      { string: 4, fret: 3 },
      { string: 3, fret: 0 },
      { string: 3, fret: 2 },
      { string: 2, fret: 0 },
      { string: 2, fret: 1 },
      { string: 2, fret: 3 },
      { string: 1, fret: 0 },
      { string: 1, fret: 1 },
      { string: 1, fret: 3 }
    ]
  },
  {
    name: 'A',
    patternRoot: 'A2',
    pattern: [
      { string: 6, fret: -2 },
      { string: 6, fret: 0 },
      { string: 6, fret: 2 },
      { string: 5, fret: -1 },
      { string: 5, fret: 0, root: true },
      { string: 5, fret: 2 },
      { string: 4, fret: -1 },
      { string: 4, fret: 0 },
      { string: 4, fret: 2 },
      { string: 3, fret: -1 },
      { string: 3, fret: 1 },
      { string: 3, fret: 2 },
      { string: 2, fret: 0 },
      { string: 2, fret: 2 },
      { string: 2, fret: 3 },
      { string: 1, fret: 0 },
      { string: 1, fret: 2 },
    ]
  },
  {
    name: 'G',
    patternRoot: 'G3',
    pattern: [
      { string: 6, fret: 0 },
      { string: 6, fret: 2 },
      { string: 6, fret: 3, root: true },
      { string: 5, fret: 0 },
      { string: 5, fret: 2 },
      { string: 5, fret: 3 },
      { string: 4, fret: 0 },
      { string: 4, fret: 2 },
      { string: 4, fret: 4 },
      { string: 3, fret: 0 },
      { string: 3, fret: 2 },
      { string: 2, fret: 0 },
      { string: 2, fret: 1 },
      { string: 2, fret: 3 },
      { string: 1, fret: 0 },
      { string: 1, fret: 2 },
      { string: 1, fret: 3 }
    ]
  },
];

export const CAGED = patterns.reduce((accumulator, { name, patternRoot, pattern }) => {
  const scaleTitle = (root) => `${root} major`;
  accumulator[name] = generateBox({ name, patternRoot, pattern, scaleTitle });
  return accumulator;
}, {});
