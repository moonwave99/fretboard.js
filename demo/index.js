import {
  Fretboard,
  CAGED,
  major
} from '../dist/fretboard.esm.js';

document.addEventListener('DOMContentLoaded', (event) => {
  const colors = {
    default: 'white',
    intervals: {
      '1P': '#F25116',
      '3M': '#F29727',
      '5P': '#F2E96B'
    },
    octaves: [null, null, 'red', 'orange', 'yellow', 'green']
  };

  const apiFretboard = new Fretboard({
    el: '#fretboard-api',
    dots: CAGED.C(),
    height: 200,
    stringsWidth: 1.5,
    dotSize: 25,
    fretCount: 15,
    fretsWidth: 1.2,
    font: 'Futura'
  });

  apiFretboard.render();

  document.querySelectorAll('.api-actions button')
    .forEach((button) => {
      button.addEventListener('click', ({ currentTarget }) => {
        switch (currentTarget.dataset.action) {
          case 'show-notes':
            apiFretboard.dots({
              text: ({ note, octave }) => note,
              fill: colors.default
            });
            break;
          case 'show-notes-with-octave':
            apiFretboard.dots({
              text: ({ note, octave }) => note + octave,
              fill: ({ octave }) => colors.octaves[octave]
            });
            break;
          case 'show-intervals':
            apiFretboard.dots({
              text: ({ interval }) => interval,
              fill: colors.default
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
              fill: colors.default,
              stroke: 'black'
            });
            break;
        }
      });
    });

  [
    { pattern: 'E', root: 'G2' },
    { pattern: 'D', root: 'G3' },
    { pattern: 'C', root: 'G3' },
    { pattern: 'A', root: 'G3' },
    { pattern: 'G', root: 'G4' }
  ].forEach(({ pattern, root }, i) => {
    const fretBoard = new Fretboard({
      el: `#fretboard-caged-${pattern.toLowerCase()}`,
      height: 200,
      stringsWidth: 1.5,
      dotSize: 25,
      fretCount: 18,
      fretsWidth: 1.2,
      dots: CAGED[pattern]({ root }),
      dotText: ({ note, position }) => {
        if ([1].indexOf(position) > -1) {
          return note;
        }
      },
      dotFill: ({ interval }) => interval === '1P' ? colors.intervals[interval] : colors.default,
      font: 'Futura'
    });
    fretBoard.render();
  });

  [
    { pattern: 1, root: 'G2' },
    { pattern: 2, root: 'G3' },
    { pattern: 3, root: 'G3' },
    { pattern: 4, root: 'G3' },
    { pattern: 5, root: 'G3' }
  ].forEach(({ pattern, root }, i) => {
    const fretBoard = new Fretboard({
      el: `#fretboard-pentatonic-${pattern}`,
      height: 200,
      stringsWidth: 1.5,
      dotSize: 25,
      fretCount: 18,
      fretsWidth: 1.2,
      dots: major[pattern - 1]({ root }),
      dotText: ({ note, position }) => {
        if ([1].indexOf(position) > -1) {
          return note;
        }
      },
      dotFill: ({ interval }) => interval === '1P' ? colors.intervals[interval] : colors.default,
      font: 'Futura'
    });
    fretBoard.render();
  });
});
