import renderFretboard from './renderer';
import { boxes } from './generator';

document.addEventListener('DOMContentLoaded', (event) => {
  const connectedBox = [
    [
      { fret: 5 },
      { fret: 7 },
      { fret: 8 }
    ],
    [
      { fret: 5 },
      { fret: 7 },
      { fret: 8, fill: '#f55' }
    ],
    [
      { fret: 4 },
      { fret: 5 },
      { fret: 7 }
    ],
    [
      { fret: 2 },
      { fret: 4 },
      { fret: 5, fill: '#f55' },
      { fret: 7 }
    ],
    [
      { fret: 2 },
      { fret: 3 },
      { fret: 5 }
    ],
    [
      { fret: 2 },
      { fret: 3, fill: '#f55' },
      { fret: 5 }
    ]
  ];

  renderFretboard({
    el: '#fretboard',
    height: 200,
    stringsWidth: 1.5,
    dotSize: 25,
    fretCount: 22,
    fretsWidth: 1.2,
    scaleFrets: true,
    dots: boxes.locrian
  });

  renderFretboard({
    el: '#linear-fretboard',
    height: 200,
    stringsWidth: 1.5,
    dotSize: 25,
    fretCount: 22,
    fretsWidth: 1.2,
    scaleFrets: false,
    dots: boxes.locrian
  });

  renderFretboard({
    el: '#connected-boxes',
    height: 200,
    stringsWidth: 1.5,
    dotSize: 25,
    fretCount: 18,
    fretsWidth: 1.2,
    scaleFrets: true,
    dots: connectedBox
  });
});
