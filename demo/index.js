import {
  Fretboard,
  CAGED,
  pentatonic,
  disableStrings
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

document.addEventListener('DOMContentLoaded', () => {
  const apiFretboard = new Fretboard({
    el: '#fretboard-api',
    dots: CAGED({
      mode: 'major',
      root: 'C3',
      box: 'C'
    }),
    ...fretboardConfiguration
  });

  apiFretboard.render();

  const connectedDots = uniqWith([
    disableStrings({
      dots: pentatonic({ box: 1, root: 'G2' }),
      strings: [3, 2, 1]
    }),
    disableStrings({
      dots: pentatonic({ box: 2, root: 'G3' }),
      strings: [6, 5]
    })
  ].flat(), (dot1, dot2) => {
    return isEqual({
      fret: dot1.fret,
      string: dot1.string
    } ,{
      fret: dot2.fret,
      string: dot2.string
    });
  });

  const connectedFretboard = new Fretboard({
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

  connectedFretboard.render();

  document.querySelectorAll('.api-actions button')
    .forEach((button) => {
      button.addEventListener('click', ({ currentTarget }) => {
        switch (currentTarget.dataset.action) {
          case 'show-notes':
            apiFretboard.dots({
              text: ({ note }) => note,
              fill: colors.defaultFill
            });
            break;
          case 'show-notes-with-octave':
            apiFretboard.dots({
              text: ({ noteWithOctave }) => noteWithOctave,
              fontSize: 10,
              fill: ({ octave }) => colors.octaves[octave]
            });
            break;
          case 'show-intervals':
            apiFretboard.dots({
              text: ({ interval }) => interval,
              fill: colors.defaultFill
            });
            break;
          case 'highlight-triad':
            apiFretboard.dots({
              filter: ({ position }) => [1, 3, 5].indexOf(position) > -1,
              stroke: 'red'
            });
            break;
          default:
            apiFretboard.dots({
              text: () => null,
              fill: colors.defaultFill,
              stroke: 'black'
            });
            break;
        }
      });
    });

  [
    { box: 'E', root: 'G2' },
    { box: 'D', root: 'G3' },
    { box: 'C', root: 'G3' },
    { box: 'A', root: 'G3' },
    { box: 'G', root: 'G3' }
  ].forEach(({ box, root }, i) => {
    const fretBoard = new Fretboard({
      el: `#fretboard-caged-${box.toLowerCase()}`,
      dots: CAGED({ box, root }),
      dotText: ({ note, interval }) => interval === '1P' ? note : null,
      dotFill: ({ interval }) => interval === '1P' ? colors.intervals[interval] : colors.defaultFill,
      ...fretboardConfiguration
    });
    fretBoard.render();
  });

  [
    { box: 1, root: 'G2' },
    { box: 2, root: 'G3' },
    { box: 3, root: 'G3' },
    { box: 4, root: 'G3' },
    { box: 5, root: 'G3' }
  ].forEach(({ box, root }, i) => {
    const fretBoard = new Fretboard({
      el: `#fretboard-pentatonic-${box}`,
      dots: pentatonic({ box, root, mode: 'major' }),
      dotText: ({ note, interval }) => interval === '1P' ? note : interval,
      dotFill: ({ interval }) => interval === '1P' ? colors.intervals[interval] : colors.defaultFill,
      ...fretboardConfiguration
    });
    fretBoard.render();
  });
});
