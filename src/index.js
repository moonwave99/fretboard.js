import renderFretboard from './fretboard';

document.addEventListener('DOMContentLoaded', (event) => {
  const dots = [
    [4, 5, 7],
    [5, 7],
    [4, 6, 7],
    [4, 6, 7],
    [4, 5, 7],
    [4, 5, 7]
  ];

  renderFretboard({
    el: '#fretboard',
    height: 200,
    stringsWidth: 1.5,
    dotSize: 25,
    fretsCount: 18,
    fretsWidth: 1.2,
    scaleFrets: true,
    dots
  });

  renderFretboard({
    el: '#linear-fretboard',
    height: 200,
    stringsWidth: 1.5,
    dotSize: 25,
    fretsCount: 18,
    fretsWidth: 1.2,
    scaleFrets: false,
    dots
  });
});
