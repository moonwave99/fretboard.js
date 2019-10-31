const colors = {
  root: '#F25116',
  M3: '#F29727',
  P5: '#F2E96B'
};

export const boxes = {
  locrian: [
    { string: 1, fret: 2 },
    { string: 1, fret: 3, fill: colors.root, text: 'G' },
    { string: 1, fret: 5 },
    { string: 2, fret: 3, fill: colors.P5, text: 'D' },
    { string: 2, fret: 5 },
    { string: 3, fret: 2 },
    { string: 3, fret: 4, fill: colors.M3, text: 'B' },
    { string: 3, fret: 5 },
    { string: 4, fret: 2 },
    { string: 4, fret: 4 },
    { string: 4, fret: 5, fill: colors.root, text: 'G' },
    { string: 5, fret: 2, fill: colors.M3, text: 'B' },
    { string: 5, fret: 3 },
    { string: 5, fret: 5, fill: colors.P5, text: 'D' },
    { string: 6, fret: 2 },
    { string: 6, fret: 3, fill: colors.root, text: 'G' },
    { string: 6, fret: 5 }
  ],
  connected: [
    { string: 1, fret: 5 },
    { string: 1, fret: 7, fill: colors.M3, text: 'B' },
    { string: 1, fret: 8 },
    { string: 2, fret: 5 },
    { string: 2, fret: 7 },
    { string: 2, fret: 8, fill: colors.root, text: 'G' },
    { string: 3, fret: 4, fill: colors.M3, text: 'B' },
    { string: 3, fret: 5 },
    { string: 3, fret: 7, fill: colors.P5, text: 'D' },
    { string: 4, fret: 2 },
    { string: 4, fret: 4 },
    { string: 4, fret: 5, fill: colors.root, text: 'G' },
    { string: 4, fret: 7 },
    { string: 5, fret: 2, fill: colors.M3, text: 'B' },
    { string: 5, fret: 3 },
    { string: 5, fret: 5, fill: colors.P5, text: 'D' },
    { string: 6, fret: 2 },
    { string: 6, fret: 3, fill: colors.root, text: 'G' },
    { string: 6, fret: 5 }
  ]
};
