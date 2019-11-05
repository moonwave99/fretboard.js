import { distance, interval } from '@tonaljs/tonal';
import { scale } from '@tonaljs/scale';
import { mod } from '../utils';

const DEFAULT_ROOT_NOTE = 'C3';
const DEFAULT_MODE = 'major';

export const generateBox = function({ name, pattern, modes, mode = DEFAULT_MODE, scaleTitle }) {
  return ({ root = DEFAULT_ROOT_NOTE } = {}) => {
    const rootIndex = modes[mode].index;
    const patternRoot = modes[mode].root;
    const { semitones } = interval(distance(patternRoot, root));
    const { intervals, notes } = scale(scaleTitle(root));

    const baseOctave = +root.substr(-1);
    let octave = baseOctave;
    if (rootIndex !== 0) {
      octave--;
    }
    return pattern.map(({ string, fret }, i) => {
      const index = mod(i - rootIndex, notes.length);
      const note = notes[index].substring(0, notes[index].length - 1);
      if (index === 0 && i > 0) {
        octave++;
      }
      return {
        string,
        fret: fret + semitones,
        note,
        octave,
        interval: intervals[index],
        position: +intervals[index][0]
      }
    });
  }
}
