import renderFretboard from './fretboard';

document.addEventListener('DOMContentLoaded', (event) => {
  const locrianBox = [
    [
      { fret: 2 },
      { fret: 3, root: true },
      { fret: 5 }
    ],
    [
      { fret: 3 },
      { fret: 5 }
    ],
    [
      { fret: 2 },
      { fret: 4 },
      { fret: 5 }
    ],
    [
      { fret: 2 },
      { fret: 4 },
      { fret: 5, root: true }
    ],
    [
      { fret: 2 },
      { fret: 3 },
      { fret: 5 }
    ],
    [
      { fret: 2 },
      { fret: 3, root: true },
      { fret: 5 }
    ]
  ];

  const connectedBox = [
    [
      { fret: 5 },
      { fret: 7 },
      { fret: 8 }
    ],
    [
      { fret: 5 },
      { fret: 7 },
      { fret: 8, root: true }
    ],
    [
      { fret: 4 },
      { fret: 5 },
      { fret: 7 }
    ],
    [
      { fret: 2 },
      { fret: 4 },
      { fret: 5, root: true },
      { fret: 7 }
    ],
    [
      { fret: 2 },
      { fret: 3 },
      { fret: 5 }
    ],
    [
      { fret: 2 },
      { fret: 3, root: true },
      { fret: 5 }
    ]
  ];

  renderFretboard({
    el: '#fretboard',
    height: 200,
    stringsWidth: 1.5,
    dotSize: 25,
    fretsCount: 18,
    fretsWidth: 1.2,
    scaleFrets: true,
    dots: locrianBox
  });

  renderFretboard({
    el: '#linear-fretboard',
    height: 200,
    stringsWidth: 1.5,
    dotSize: 25,
    fretsCount: 18,
    fretsWidth: 1.2,
    scaleFrets: false,
    dots: locrianBox
  });

  renderFretboard({
    el: '#connected-boxes',
    height: 200,
    stringsWidth: 1.5,
    dotSize: 25,
    fretsCount: 18,
    fretsWidth: 1.2,
    scaleFrets: true,
    dots: connectedBox
  });  
});
