import { scale as getScale } from '@tonaljs/scale';

function getStringPattern({
  patternIndex = 0,
  string = 6,
  baseFret = 0,
}): {
  string: number;
  fret: number;
}[] {
  const patterns = [
    [0, 2, 4],
    [0, 1, 3],
    [0, 2, 3]
  ];
  return patterns[patternIndex].reduce(
    (memo, jump) => ([...memo, { string, fret: baseFret + jump }])
  , []);
}

const modes = [
  {
    name: 'ionian',
    aliases: ['major']
  },
  {
    name: 'dorian'
  },
  {
    name: 'phrygian'
  },
  {
    name: 'lydian'
  },
  {
    name: 'mixolydian'
  },
  {
    name: 'aeolian',
    aliases: ['minor', 'natural minor']
  },
  {
    name: 'locrian'
  }
] as {
  name: string;
  aliases?: string[];
}[];

const baseScale = getScale('E2 major');

function getModes(mode = 'ionian'): {
  name: string;
  aliases?: string[];
  root: string;
  index: number;
}[] {
  const output = [];
  const modeIndex = modes.findIndex(({ name }) => name === mode);
  const baseNote = baseScale.notes[modeIndex];

  const { notes: scale } = getScale(`${baseNote} ${mode}`);
  for (let index = 0; index < modes.length; index++) {
    const foundIndex = (modeIndex + index) % modes.length;
    output.push({
      ...modes[foundIndex],
      root: scale[index],
      index
    });
  }

  console.log(output)

  return output;
}

export const boxes = [
  {
    modes: getModes('ionian'),
    pattern: [
      ...getStringPattern({ string: 6, patternIndex: 0, baseFret: 0 }),
      ...getStringPattern({ string: 5, patternIndex: 0, baseFret: 0 }),
      ...getStringPattern({ string: 4, patternIndex: 1, baseFret: 1 }),
      ...getStringPattern({ string: 3, patternIndex: 1, baseFret: 1 }),
      ...getStringPattern({ string: 2, patternIndex: 2, baseFret: 2 }),
      ...getStringPattern({ string: 1, patternIndex: 2, baseFret: 2 })
    ]
  },
  {
    modes: getModes('dorian'),
    pattern: [
      ...getStringPattern({ string: 6, patternIndex: 2, baseFret: 0 + 2 }),
      ...getStringPattern({ string: 5, patternIndex: 0, baseFret: 0 + 2 }),
      ...getStringPattern({ string: 4, patternIndex: 0, baseFret: 0 + 2 }),
      ...getStringPattern({ string: 3, patternIndex: 2, baseFret: 1 + 2 }),
      ...getStringPattern({ string: 2, patternIndex: 1, baseFret: 2 + 2 }),
      ...getStringPattern({ string: 1, patternIndex: 1, baseFret: 2 + 2 })
    ]
  },
  {
    modes: getModes('phrygian'),
    pattern: [
      ...getStringPattern({ string: 6, patternIndex: 1, baseFret: 0 + 3 }),
      ...getStringPattern({ string: 5, patternIndex: 2, baseFret: 0 + 3 }),
      ...getStringPattern({ string: 4, patternIndex: 2, baseFret: 0 + 3 }),
      ...getStringPattern({ string: 3, patternIndex: 0, baseFret: 0 + 3 }),
      ...getStringPattern({ string: 2, patternIndex: 0, baseFret: 1 + 3 }),
      ...getStringPattern({ string: 1, patternIndex: 0, baseFret: 1 + 3 })
    ]
  },
  {
    modes: getModes('lydian'),
    pattern: [
      ...getStringPattern({ string: 6, patternIndex: 0, baseFret: 0 + 5 }),
      ...getStringPattern({ string: 5, patternIndex: 1, baseFret: 1 + 5 }),
      ...getStringPattern({ string: 4, patternIndex: 1, baseFret: 1 + 5 }),
      ...getStringPattern({ string: 3, patternIndex: 2, baseFret: 1 + 5 }),
      ...getStringPattern({ string: 2, patternIndex: 2, baseFret: 1 + 5 }),
      ...getStringPattern({ string: 1, patternIndex: 0, baseFret: 1 + 5 })
    ]
  },
  {
    modes: getModes('mixolydian'),
    pattern: [
      ...getStringPattern({ string: 6, patternIndex: 0, baseFret: 0 + 7 }),
      ...getStringPattern({ string: 5, patternIndex: 0, baseFret: 0 + 7 }),
      ...getStringPattern({ string: 4, patternIndex: 0, baseFret: 0 + 7 }),
      ...getStringPattern({ string: 3, patternIndex: 1, baseFret: 1 + 7 }),
      ...getStringPattern({ string: 2, patternIndex: 1, baseFret: 2 + 7 }),
      ...getStringPattern({ string: 1, patternIndex: 2, baseFret: 2 + 7 })
    ]
  },
  {
    modes: getModes('aeolian'),
    pattern: [
      ...getStringPattern({ string: 6, patternIndex: 2, baseFret: 0 + 9 }),
      ...getStringPattern({ string: 5, patternIndex: 2, baseFret: 0 + 9 }),
      ...getStringPattern({ string: 4, patternIndex: 0, baseFret: 0 + 9 }),
      ...getStringPattern({ string: 3, patternIndex: 0, baseFret: 0 + 9 }),
      ...getStringPattern({ string: 2, patternIndex: 0, baseFret: 1 + 9 }),
      ...getStringPattern({ string: 1, patternIndex: 1, baseFret: 2 + 9 })
    ]
  },
  {
    modes: getModes('locrian'),
    pattern: [
      ...getStringPattern({ string: 6, patternIndex: 1, baseFret: 0 + 11 }),
      ...getStringPattern({ string: 5, patternIndex: 1, baseFret: 0 + 11 }),
      ...getStringPattern({ string: 4, patternIndex: 2, baseFret: 0 + 11 }),
      ...getStringPattern({ string: 3, patternIndex: 2, baseFret: 0 + 11 }),
      ...getStringPattern({ string: 2, patternIndex: 0, baseFret: 1 + 11 }),
      ...getStringPattern({ string: 1, patternIndex: 0, baseFret: 1 + 11 })
    ]
  }
];
