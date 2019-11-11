import {
  Fretboard,
  CAGED,
  pentatonic,
  disableDots
} from '../dist/fretboard.esm.js';

import { isEqual, uniqWith } from 'lodash';

const fretboardConfiguration = {
  height: 200,
  stringsWidth: 1.5,
  dotSize: 25,
  fretCount: 16,
  fretsWidth: 1.2,
  font: 'Futura'
};

const colors = {
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

function apiExample(box = CAGED({ mode: 'major', root: 'C3', box: 'C'})) {
  const fretboard = new Fretboard({
    el: '#fretboard-api',
    dots: box,
    ...fretboardConfiguration
  });
  fretboard.render();

  document.querySelectorAll('.api-actions button')
    .forEach((button) => {
      button.addEventListener('click', ({ currentTarget }) => {
        switch (currentTarget.dataset.action) {
          case 'show-notes':
            fretboard.dots({
              text: ({ note }) => note,
              fill: colors.defaultFill
            });
            break;
          case 'show-notes-with-octave':
            fretboard.dots({
              text: ({ noteWithOctave }) => noteWithOctave,
              fontSize: 10,
              fill: ({ octave }) => colors.octaves[octave]
            });
            break;
          case 'show-intervals':
            fretboard.dots({
              text: ({ interval }) => interval,
              fill: colors.defaultFill
            });
            break;
          case 'highlight-triad':
            fretboard.dots({
              filter: ({ position }) => [1, 3, 5].indexOf(position) > -1,
              stroke: 'red'
            });
            break;
          default:
            fretboard.dots({
              text: () => null,
              fill: colors.defaultFill,
              stroke: 'black'
            });
            break;
      }
    });
  });
}

function connectedExample({
  box1 = CAGED({ box: 'C', root: 'D3' }),
  box2 = CAGED({ box: 'A', root: 'D3' })
} = {}) {
  function enableCommonDots({ string, fret, ...dot }) {
    const isInBox1 = box1.findIndex(x => x.string === string && x.fret === fret) > -1;
    const isInBox2 = box2.findIndex(x => x.string === string && x.fret === fret) > -1;
    if (isInBox1 && isInBox2) {
      return { string, fret, ...dot, disabled: false }
    }
    return { string, fret, ...dot };
  }

  const connectedDots = uniqWith([
    disableDots({
      box: box1,
      from: { string: 3, fret: 2 }
    }),
    disableDots({
      box: box2,
      to: { string: 4, fret: 5 }
    })
  ].flat(), (dot1, dot2) => {
    return isEqual({
      fret: dot1.fret,
      string: dot1.string
    } ,{
      fret: dot2.fret,
      string: dot2.string
    });
  }).map(enableCommonDots);

  const fretboard = new Fretboard({
    el: '#fretboard-connected',
    dots: connectedDots,
    dotText: ({ note, interval, disabled }) => !disabled && interval === '1P' ? note : '',
    dotFill: ({ interval, disabled }) => {
      if (disabled) {
        return colors.disabled;
      }
      return interval === '1P' ? colors.intervals[interval] : colors.defaultFill
    },
    dotStrokeColor: ({ disabled }) => disabled ? colors.disabled : colors.defaultStroke,
    ...fretboardConfiguration
  });
  fretboard.render();
}

function cagedExample(boxes = []) {
  boxes.forEach(({ box, root }, i) => {
    const fretBoard = new Fretboard({
      el: `#fretboard-caged-${box.toLowerCase()}`,
      dots: CAGED({ box, root }),
      dotText: ({ note, interval }) => interval === '1P' ? note : null,
      dotFill: ({ interval }) => interval === '1P' ? colors.intervals[interval] : colors.defaultFill,
      ...fretboardConfiguration
    });
    fretBoard.render();
  });
}

function pentatonicExample(boxes = []) {
  boxes.forEach(({ box, root }, i) => {
    const fretBoard = new Fretboard({
      el: `#fretboard-pentatonic-${box}`,
      dots: pentatonic({ box, root, mode: 'major' }),
      dotText: ({ note, interval }) => interval === '1P' ? note : interval,
      dotFill: ({ interval }) => interval === '1P' ? colors.intervals[interval] : colors.defaultFill,
      ...fretboardConfiguration
    });
    fretBoard.render();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  apiExample(CAGED({
    mode: 'major',
    root: 'C3',
    box: 'C'
  }));
  connectedExample({
    box1: CAGED({ box: 'C', root: 'D3' }),
    box2: CAGED({ box: 'A', root: 'D3' })
  });
  cagedExample([
    { box: 'E', root: 'G2' },
    { box: 'D', root: 'G3' },
    { box: 'C', root: 'G3' },
    { box: 'A', root: 'G3' },
    { box: 'G', root: 'G3' }
  ]);
  pentatonicExample([
    { box: 1, root: 'G2' },
    { box: 2, root: 'G3' },
    { box: 3, root: 'G3' },
    { box: 4, root: 'G3' },
    { box: 5, root: 'G3' }
  ]);
});
