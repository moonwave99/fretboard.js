import { Fretboard } from '../../../dist/fretboard.esm.js';

import { fretboardConfiguration, colors } from '../config.js';

const barres = {
  F: {
    fret: 1,
  },
  Bm: {
    fret: 2,
    stringFrom: 5,
  },
  C: [
    {
      fret: 3,
      stringFrom: 5,
    },
    {
      fret: 5,
      stringFrom: 4,
      stringTo: 2,
    },
  ],
  'A7#9': [{
    fret: 5,
    stringTo: 4
  }, {
    fret: 8,
    stringFrom: 2
  }],
  'D6/9': {
    fret: 4,
    stringFrom: 4,
    stringTo: 3
  }
};

function getFretCount(chord, fretLeftPadding = 0) {
  let normalisedChord = chord.indexOf('-') > 1
    ? chord.split('-')
    : chord.split('');
  const frets = normalisedChord
    .filter((x) => x !== 'x')
    .map((x) => +x)
    .sort((a, b) => a - b);
  return frets[frets.length - 1] - frets[0] + +fretLeftPadding + 1;
}

export default function chords() {
  document.querySelectorAll('.chords figure').forEach(el => {
    const {
      name,
      chord,
      crop,
      showFretNumbers,
      fretLeftPadding,
      mutedStrings,
      barred,
      fretCount,
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
      fretCount: fretCount || getFretCount(chord, fretLeftPadding),
      dotSize: 25,
      dotStrokeWidth: 3,
      fretNumbersMargin: 30,
      showFretNumbers: !!showFretNumbers,
      fretLeftPadding: fretLeftPadding ? +fretLeftPadding : 0,
      crop,
    }).renderChord(chord, barred ? barres[name] : null);
    const figCaption = document.createElement('figcaption');
    figCaption.innerHTML = `${name}<br><code>${chord}</code>`;
    el.append(figCaption);
  });
}
