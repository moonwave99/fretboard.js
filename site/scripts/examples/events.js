import { Fretboard } from '../../../dist/fretboard.esm.js';
import { get as getScale } from '@tonaljs/scale';

import { fretboardConfiguration, colors } from '../config.js';

export default function events() {
  const fretboardNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'].reverse().map(note => {
    const [noteName, octave] = note.split('');
    return [
      ...getScale(`${note} chromatic`).notes,
      ...getScale(`${noteName}${+octave + 1} chromatic`).notes
    ];
  });
  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    dotText: ({ note }) => note,
  });
  fretboard.render([]);
  fretboard.on('mousemove', ({ fret, string }) => {
    const note = fretboardNotes[string - 1][fret];
    fretboard.render([
      {
        fret,
        string,
        note: note.substring(0, note.length - 1)
      }
    ])
  });
}
