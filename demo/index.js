import {
  Fretboard,
  CAGED,
  pentatonic,
} from '../dist/fretboard.esm.js';

document.addEventListener('DOMContentLoaded', (event) => {
  const colors = {
    default: 'white',
    intervals: {
      '1P': '#F25116',
      '3M': '#F29727',
      '5P': '#F2E96B'
    },
    octaves: ['blue', 'magenta', 'red', 'orange', 'yellow', 'green']
  };

  const apiFretboard = new Fretboard({
    el: '#fretboard-api',
    dots: CAGED({
      mode: 'major',
      root: 'C3',
      box: 'C'
    }),
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
              text: ({ note }) => note,
              fill: colors.default
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
    { box: 'E', root: 'G2' },
    { box: 'D', root: 'G3' },
    { box: 'C', root: 'G3' },
    { box: 'A', root: 'G3' },
    { box: 'G', root: 'G3' }
  ].forEach(({ box, root }, i) => {
    const fretBoard = new Fretboard({
      el: `#fretboard-caged-${box.toLowerCase()}`,
      height: 200,
      stringsWidth: 1.5,
      dotSize: 25,
      fretCount: 18,
      fretsWidth: 1.2,
      dots: CAGED({ box, root }),
      dotText: ({ note, interval }) => interval === '1P' ? note : null,
      dotFill: ({ interval }) => interval === '1P' ? colors.intervals[interval] : colors.default,
      font: 'Futura'
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
      height: 200,
      stringsWidth: 1.5,
      dotSize: 25,
      fretCount: 18,
      fretsWidth: 1.2,
      dots: pentatonic({ box, root, mode: 'major' }),
      dotText: ({ note, interval }) => interval === '1P' ? note : interval,
      dotFill: ({ interval }) => interval === '1P' ? colors.intervals[interval] : colors.default,
      font: 'Futura'
    });
    fretBoard.render();
  });
});
