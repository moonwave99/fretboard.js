import renderFretboard from './renderer';
import { boxes } from './generator';

document.addEventListener('DOMContentLoaded', (event) => {
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
    dots: boxes.connected
  });
});
