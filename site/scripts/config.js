export const fretboardConfiguration = {
  height: 200,
  stringsWidth: 1.5,
  dotSize: 25,
  fretCount: 16,
  fretsWidth: 1.2,
  font: 'Futura'
};

export const colors = {
  defaultFill: 'white',
  defaultStroke: 'black',
  disabled: '#aaa',
  intervals: {
    '1P': '#F25116',
    '3M': '#F29727',
    '5P': '#F2E96B'
  },
  octaves: ['blue', 'magenta', 'red', 'orange', 'yellow', 'green']
};

export const modeMap = [
  {
    root: 'C',
    mode: 'ionian',
    color: '#e76f51'
  },
  {
    root: 'D',
    mode: 'dorian',
    color: '#6a994e'
  },
  {
    root: 'E',
    mode: 'phrygian',
    color: '#8338ec'
  },
  {
    root: 'F',
    mode: 'lydian',
    color: '#ffbd00'
  },
  {
    root: 'G',
    mode: 'mixolydian',
    color: '#e36414'
  },
  {
    root: 'A',
    mode: 'aeolian',
    color: '#00bbf9'
  },
  {
    root: 'B',
    mode: 'locrian',
    color: '#1D5DF2'
  }
];

export const chordDiagrams = {
  'C': [
    { string: 5, fret: 3, note: 'C', interval: '1P' },
    { string: 4, fret: 2, note: 'E', interval: '3M' },
    { string: 2, fret: 1, note: 'C', interval: '1P' },
  ],
  'Am': [
    { string: 4, fret: 2, note: 'E', interval: '5P' },
    { string: 3, fret: 2, note: 'A', interval: '1P' },
    { string: 2, fret: 1, note: 'C', interval: '3m' },
  ],
  'G': [
    { string: 6, fret: 3, note: 'G', interval: '1P' },
    { string: 5, fret: 2, note: 'B', interval: '3M' },
    { string: 1, fret: 3, note: 'G', interval: '1P' },
  ],
  'E': [
    { string: 5, fret: 2, note: 'B', interval: '5P' },
    { string: 4, fret: 2, note: 'E', interval: '1P' },
    { string: 3, fret: 1, note: 'G#', interval: '3M' },
  ],
  'D': [
    { string: 3, fret: 2, note: 'D', interval: '5P' },
    { string: 2, fret: 3, note: 'A', interval: '1P' },
    { string: 1, fret: 2, note: 'F#', interval: '3M' },
  ],
  'E7#9': [
    { string: 5, fret: 7, note: 'E', interval: '1P' },
    { string: 4, fret: 6, note: 'G#', interval: '3M' },
    { string: 3, fret: 7, note: 'D', interval: '7m' },
    { string: 2, fret: 8, note: 'F##', interval: '9A' },
  ],
  'G7#5': [
    { string: 6, fret: 3, note: 'G', interval: '1P' },
    { string: 4, fret: 3, note: 'F', interval: '7m' },
    { string: 3, fret: 4, note: 'B', interval: '3M' },
    { string: 2, fret: 4, note: 'D#', interval: '5A' },
  ],
  'Amaj7': [
    { string: 6, fret: 5, note: 'A', interval: '1P' },
    { string: 4, fret: 6, note: 'G#', interval: '7M' },
    { string: 3, fret: 6, note: 'C#', interval: '3M' },
    { string: 2, fret: 5, note: 'E', interval: '5P' },
  ],
  'Dm7add11': [
    { string: 6, fret: 10, note: 'D', interval: '1P' },
    { string: 4, fret: 10, note: 'C', interval: '7m' },
    { string: 3, fret: 10, note: 'F', interval: '3m' },
    { string: 2, fret: 8, note: 'G', interval: 'P4' },
  ],
  'C#m7b5': [
    { string: 5, fret: 4, note: 'C#', interval: '1P' },
    { string: 4, fret: 5, note: 'G', interval: '5d' },
    { string: 3, fret: 4, note: 'B', interval: '7m' },
    { string: 2, fret: 5, note: 'E', interval: '3m' },
  ]
};
