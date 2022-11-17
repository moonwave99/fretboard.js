import { Fretboard } from '../../../dist/fretboard.esm.js';

import { fretboardConfiguration, colors } from '../config.js';

export default function highlight() {
  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    dotText: ({ note }) => note,
  });
  fretboard
    .renderScale({
      type: 'major',
      root: 'G',
    })
    .style({
      fill: (dot, index) =>
        dot.degree === 1 ? colors.defaultActiveFill : 'white',
    })
    .highlightAreas(
      [
        { string: 1, fret: 5 },
        { string: 6, fret: 2 },
      ],
      [
        { string: 1, fret: 13 },
        { string: 6, fret: 9 },
      ]
    );
}
