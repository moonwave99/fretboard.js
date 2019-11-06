import { distance, interval } from '@tonaljs/tonal';
import { scale } from '@tonaljs/scale';

export function mod (n, m) {
  return ((n % m) + m) % m;
};

export function generateBox({ name, scaleTitle, pattern, root, modeSchema }) {
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


export function findMode({ modes, modeName }) {
  const found = modes.find(({ name, aliases = [] }) =>
    name === modeName || aliases.indexOf(modeName) > -1
  );
  if (!found) {
    return false;
  }
  return found;
};
