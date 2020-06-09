import { Fretboard } from '../../../dist/fretboard.esm.js';

import { fretboardConfiguration, colors, chordDiagrams } from '../config.js';

export default function chords() {
  document.querySelectorAll('.chords figure').forEach(el => {
    const {
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
    }).render(chordDiagrams[chord]);

    if (mutedStrings) {
      fretboard.muteStrings({ strings: JSON.parse(mutedStrings) });
    }
    const figCaption = document.createElement('figcaption');
    figCaption.innerHTML = chord;
    el.append(figCaption);
  });
}
