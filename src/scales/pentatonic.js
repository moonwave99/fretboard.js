import { generateBox } from './generator';

const majorPatterns = [
  {
    name: 'Pentatonic Major 1',
    patternRoot: 'E2',
    pattern: [
      { string: 6, fret: 0, root: true },
      { string: 6, fret: 2 },
      { string: 5, fret: -1 },
      { string: 5, fret: 2 },
      { string: 4, fret: -1 },
      { string: 4, fret: 2 },
      { string: 3, fret: -1 },
      { string: 3, fret: 1 },
      { string: 2, fret: 0 },
      { string: 2, fret: 2 },
      { string: 1, fret: 0 },
      { string: 1, fret: 2 }
    ]
  },
  {
    name: 'Pentatonic Major 2',
    patternRoot: 'D3',
    pattern: [
      { string: 6, fret: 0 },
      { string: 6, fret: 2 },
      { string: 5, fret: 0 },
      { string: 5, fret: 2 },
      { string: 4, fret: 0, root: true  },
      { string: 4, fret: 2 },
      { string: 3, fret: -1 },
      { string: 3, fret: 2 },
      { string: 2, fret: 0 },
      { string: 2, fret: 3 },
      { string: 1, fret: 0 },
      { string: 1, fret: 2 }
    ]
  },
  {
    name: 'Pentatonic Major 3',
    patternRoot: 'C3',
    pattern: [
      { string: 6, fret: 0 },
      { string: 6, fret: 3 },
      { string: 5, fret: 0 },
      { string: 5, fret: 3, root: true },
      { string: 4, fret: 0 },
      { string: 4, fret: 2 },
      { string: 3, fret: 0 },
      { string: 3, fret: 2 },
      { string: 2, fret: 1 },
      { string: 2, fret: 3 },
      { string: 1, fret: 0 },
      { string: 1, fret: 3 }
    ]
  },
  {
    name: 'Pentatonic Major 4',
    patternRoot: 'A2',
    pattern: [
      { string: 6, fret: 0 },
      { string: 6, fret: 2 },
      { string: 5, fret: 0, root: true },
      { string: 5, fret: 2 },
      { string: 4, fret: -1 },
      { string: 4, fret: 2 },
      { string: 3, fret: -1 },
      { string: 3, fret: 2 },
      { string: 2, fret: 0 },
      { string: 2, fret: 2 },
      { string: 1, fret: 0 },
      { string: 1, fret: 2 }
    ]
  },
  {
    name: 'Pentatonic Major 5',
    patternRoot: 'G2',
    pattern: [
      { string: 6, fret: 0 },
      { string: 6, fret: 3, root: true },
      { string: 5, fret: 0 },
      { string: 5, fret: 2 },
      { string: 4, fret: 0 },
      { string: 4, fret: 2 },
      { string: 3, fret: 0 },
      { string: 3, fret: 2 },
      { string: 2, fret: 0 },
      { string: 2, fret: 3 },
      { string: 1, fret: 0 },
      { string: 1, fret: 3 }
    ]
  }
];

export const major = majorPatterns.map(({ name, patternRoot, pattern }) => {
  const scaleTitle = (root) => `${root} major pentatonic`;
  return generateBox({ name, patternRoot, pattern, scaleTitle });
});
