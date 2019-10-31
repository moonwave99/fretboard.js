import renderFretboard from './renderer';
import { CAGED } from './generator';

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
    renderFretboard({
      el: `#fretboard-caged-${pattern.toLowerCase()}`,
      height: 200,
      stringsWidth: 1.5,
      dotSize: 25,
      fretCount: 18,
      fretsWidth: 1.2,
      scaleFrets: true,
      dots: CAGED[pattern]({ root }),
      renderText: ({ note, position }) => {
        if ([1, 3, 5].indexOf(position) > -1) {
          return note;
        }
      },
      dotFill: ({ interval }) => colors[interval] || colors.default
    });
  });
});
