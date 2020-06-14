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
