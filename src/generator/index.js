const colors = {
  root: '#F25116',
  M3: '#F29727',
  P5: '#F2E96B'
};

export const boxes = {
  locrian: [
    [
      { fret: 2 },
      { fret: 3, fill: colors.root, text: 'G' },
      { fret: 5 }
    ],
    [
      { fret: 3, fill: colors.P5, text: 'D' },
      { fret: 5 }
    ],
    [
      { fret: 2 },
      { fret: 4, fill: colors.M3, text: 'B' },
      { fret: 5 }
    ],
    [
      { fret: 2 },
      { fret: 4 },
      { fret: 5, fill: colors.root, text: 'G' }
    ],
    [
      { fret: 2, fill: colors.M3, text: 'B' },
      { fret: 3 },
      { fret: 5, fill: colors.P5, text: 'D' }
    ],
    [
      { fret: 2 },
      { fret: 3, fill: colors.root, text: 'G' },
      { fret: 5 }
    ]
  ],
  connected: [
    [
      { fret: 5 },
      { fret: 7, fill: colors.M3, text: 'B' },
      { fret: 8 }
    ],
    [
      { fret: 5 },
      { fret: 7 },
      { fret: 8, fill: colors.root, text: 'G' }
    ],
    [
      { fret: 4, fill: colors.M3, text: 'B' },
      { fret: 5 },
      { fret: 7, fill: colors.P5, text: 'D' }
    ],
    [
      { fret: 2 },
      { fret: 4 },
      { fret: 5, fill: colors.root, text: 'G' },
      { fret: 7 }
    ],
    [
      { fret: 2, fill: colors.M3, text: 'B' },
      { fret: 3 },
      { fret: 5, fill: colors.P5, text: 'D' }
    ],
    [
      { fret: 2 },
      { fret: 3, fill: colors.root, text: 'G' },
      { fret: 5 }
    ]
  ]
};
