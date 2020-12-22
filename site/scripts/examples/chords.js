import { Fretboard } from '../../../dist/fretboard.esm.js';

import { fretboardConfiguration, colors } from '../config.js';

export default function chords() {
  document.querySelectorAll('.chords figure').forEach(el => {
    const {
      name,
      chord,
      crop,
      showFretNumbers,
      fretLeftPadding,
      mutedStrings
    } = el.dataset;
    const fretboard = new Fretboard({
      ...fretboardConfiguration,
      el,
      width: 300,
      height: 200,
      bottomPadding: 0,
      scaleFrets: false,
      stringWidth: 2,
      fretWidth: 2,
      fretCount: 3,
      dotSize: 25,
      dotStrokeWidth: 3,
      fretNumbersMargin: 30,
      showFretNumbers: !!showFretNumbers,
      fretLeftPadding: fretLeftPadding ? +fretLeftPadding : 0,
      crop
    }).renderChord(chord);

    const figCaption = document.createElement('figcaption');
    figCaption.innerHTML = `${name}<br><code>${chord}</code>`;
    el.append(figCaption);
  });
}
