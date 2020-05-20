import { isEqual, uniqWith } from 'lodash';

import {
  Fretboard,
  CAGED,
  pentatonic,
  disableDots
} from '../../dist/fretboard.esm.js';

import './navbar.js';
import '../styles/style.css';

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

function connectedCagedExample({
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
    el: '#fretboard-connected-caged',
    dotText: ({ note, interval, disabled }) => !disabled && interval === '1P' ? note : '',
    dotFill: ({ interval, disabled }) => {
      if (disabled) {
        return colors.disabled;
      }
      return interval === '1P' ? colors.intervals[interval] : colors.defaultFill
    },
    dotStrokeColor: ({ disabled }) => disabled ? colors.disabled : colors.defaultStroke,
    ...fretboardConfiguration,
    fretCount: 18
  });
  fretboard.render(connectedDots);
}

function connectedPentatonicExample({
  box1 = pentatonic({ box: 4, root: 'E3', mode: 'minor' }),
  box2 = pentatonic({ box: 5, root: 'E3', mode: 'minor' })
} = {}) {
  const commonDots = uniqWith([
    ...box1,
    ...box2
  ].flat(), (dot1, dot2) => {
    return isEqual({
      fret: dot1.fret,
      string: dot1.string
    } ,{
      fret: dot2.fret,
      string: dot2.string
    });
  });

  const fretboard = new Fretboard({
    el: '#fretboard-connected-pentatonic',
    dotText: ({ note }) => note,
    dotFill: ({ note }) => note === 'E' ? colors.intervals['1P'] : colors.defaultFill,
    ...fretboardConfiguration,
    fretCount: 18
  });
  fretboard.render(commonDots);
}

function cagedExample(boxes = []) {
  boxes.forEach(({ box, root }, i) => {
    const fretBoard = new Fretboard({
      el: `#fretboard-caged-${box.toLowerCase()}`,
      dotText: ({ note, interval }) => interval === '1P' ? note : null,
      dotFill: ({ interval }) => interval === '1P' ? colors.intervals[interval] : colors.defaultFill,
      ...fretboardConfiguration,
      fretCount: 17
    });
    fretBoard.render(
      CAGED({ box, root })
    );
  });
}

function pentatonicExample(boxes = []) {
  boxes.forEach(({ box, root }, i) => {
    const fretBoard = new Fretboard({
      el: `#fretboard-pentatonic-${box}`,
      dotText: ({ note, interval }) => interval === '1P' ? note : interval,
      dotFill: ({ interval }) => interval === '1P' ? colors.intervals[interval] : colors.defaultFill,
      ...fretboardConfiguration
    });
    fretBoard.render(
      pentatonic({ box, root, mode: 'major' }),
    );
  });
}

document.addEventListener('DOMContentLoaded', () => {
  connectedCagedExample({
    box1: CAGED({ box: 'C', root: 'D3' }),
    box2: CAGED({ box: 'A', root: 'D3' })
  });
  connectedPentatonicExample({
    box1: pentatonic({ box: 4, root: 'E3', mode: 'minor' }),
    box2: pentatonic({ box: 5, root: 'E3', mode: 'minor' })
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
