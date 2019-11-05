import { generateBox } from './generator';

const boxes = [
  {
    modes: {
      major: {
        root: 'E2',
        index: 0
      },
      minor: {
        root: 'C#2',
        index: 4
      }
    },
    pattern: [
      { string: 6, fret: 0 },
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
    modes: {
      major: {
        root: 'D3',
        index: 4
      },
      minor: {
        root: 'B2',
        index: 3
      }
    },
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
    modes: {
      major: {
        root: 'C3',
        index: 3
      },
      minor: {
        root: 'A2',
        index: 2
      }
    },
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
    modes: {
      major: {
        root: 'A2',
        index: 2
      },
      minor: {
        root: 'F#2',
        index: 1
      }
    },
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
    modes: {
      major: {
        root: 'G2',
        index: 1
      },
      minor: {
        root: 'E2',
        index: 0
      }
    },
    pattern: [
      { string: 6, fret: 0 },
      { string: 6, fret: 3 },
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

const DEFAULT_ROOT_NOTE = 'C3';
const DEFAULT_MODE = 'major';
const DEFAULT_BOX = 1;

export function pentatonic ({ mode = DEFAULT_MODE, root = DEFAULT_ROOT_NOTE, box } = {}) {
  const { pattern, modes } = boxes[box - 1];
  const modeSchema = modes[mode];
  return generateBox({
    name: `Pentatonic ${mode} box ${box}`,
    scaleTitle: `${root} ${mode} pentatonic`,
    pattern,
    root,
    modeSchema
  });
}
