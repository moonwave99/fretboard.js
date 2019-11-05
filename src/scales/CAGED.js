import { generateBox } from './generator';

const boxes = {
  E: {
    modes: {
      major: {
        root: 'E2',
        index: 1
      },
      minor: {
        root: 'C#2',
        index: 6
      }
    },
    pattern: [
      { string: 6, fret: -1 },
      { string: 6, fret: 0 },
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
  D: {
    modes: {
      major: {
        root: 'D3',
        index: 6
      },
      minor: {
        root: 'B2',
        index: 4
      }
    },
    pattern: [
      { string: 6, fret: 0 },
      { string: 6, fret: 2 },
      { string: 6, fret: 3 },
      { string: 5, fret: 0 },
      { string: 5, fret: 2 },
      { string: 4, fret: -1 },
      { string: 4, fret: 0 },
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
  C: {
    modes: {
      major: {
        root: 'C3',
        index: 5
      },
      minor: {
        root: 'A2',
        index: 3
      }
    },
    pattern: [
      { string: 6, fret: 0 },
      { string: 6, fret: 1 },
      { string: 6, fret: 3 },
      { string: 5, fret: 0 },
      { string: 5, fret: 2 },
      { string: 5, fret: 3 },
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
  A: {
    modes: {
      major: {
        root: 'A2',
        index: 4
      },
      minor: {
        root: 'F#2',
        index: 2
      }
    },
    pattern: [
      { string: 6, fret: -2 },
      { string: 6, fret: 0 },
      { string: 6, fret: 2 },
      { string: 5, fret: -1 },
      { string: 5, fret: 0 },
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
  G: {
    modes: {
      major: {
        root: 'G2',
        index: 2
      },
      minor: {
        root: 'E2',
        index: 0
      }
    },
    pattern: [
      { string: 6, fret: 0 },
      { string: 6, fret: 2 },
      { string: 6, fret: 3 },
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
};

const DEFAULT_ROOT_NOTE = 'C3';
const DEFAULT_MODE = 'major';
const DEFAULT_BOX = 'C';

export function CAGED ({ mode = DEFAULT_MODE, root = DEFAULT_ROOT_NOTE, box = DEFAULT_BOX } = {}) {
  const { pattern, modes } = boxes[box];
  const modeSchema = modes[mode];
  return generateBox({
    name: `CAGED ${box} box - ${root }${mode}`,
    scaleTitle: `${root} ${mode}`,
    pattern,
    root,
    modeSchema
  });
}
