import Fretboard from './Fretboard';
import { CAGED } from './scales/CAGED';
import { major } from './scales/pentatonic';

document.addEventListener('DOMContentLoaded', (event) => {
  const colors = {
    default: 'white',
    '1P': '#F25116',
    '3M': '#F29727',
    '5P': '#F2E96B'
  };

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
      scaleFrets: true,
      dots: CAGED[pattern]({ root }),
      renderDotText: ({ note, position }) => {
        if ([1, 3, 5].indexOf(position) > -1) {
          return note;
        }
      },
      dotFill: ({ interval }) => colors[interval] || colors.default,
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
      scaleFrets: true,
      dots: major[pattern - 1]({ root }),
      renderDotText: ({ note, position }) => {
        if ([1].indexOf(position) > -1) {
          return note;
        }
      },
      dotFill: ({ interval }) => interval === '1P' ? colors[interval] : colors.default,
      font: 'Futura'
    });
    fretBoard.render();
  });
});
