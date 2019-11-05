import { distance, interval } from '@tonaljs/tonal';
import { scale } from '@tonaljs/scale';
import { mod } from '../utils';

export const generateBox = function({ name, scaleTitle, pattern, root, modeSchema }) {
  const rootIndex = modeSchema.index;
  const patternRoot = modeSchema.root;
  const { semitones } = interval(distance(patternRoot, root));
  const { intervals, notes } = scale(scaleTitle);
  const baseOctave = +root.substr(-1);

  let octaveIncrement = 0;
  if (rootIndex !== 0) {
    octaveIncrement--;
  }

  return pattern.map(({ string, fret }, i) => {
    const index = mod(i - rootIndex, notes.length);
    const note = notes[index].substring(0, notes[index].length - 1);
    const octave = +notes[index].substr(-1);
    if (index === 0 && i > 0) {
      octaveIncrement++;
    }
    return {
      string,
      fret: fret + semitones,
      note,
      noteWithOctave: note + (octave + octaveIncrement),
      octave: baseOctave + octaveIncrement,
      interval: intervals[index],
      position: +intervals[index][0]
    }
  });
}
