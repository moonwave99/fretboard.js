import { distance, interval } from '@tonaljs/tonal';
import { get as getScale } from '@tonaljs/scale';
import { Position, Mode } from './scales';

export function mod (n: number, m: number): number {
  return ((n % m) + m) % m;
}

export function generateBox({
  scaleTitle,
  pattern,
  root,
  modeSchema
}: {
  name: string;
  scaleTitle: string;
  pattern: {
    string: number;
    fret: number;
  }[];
  root: string;
  modeSchema: Mode;
}): Position[] {
  const {
    index: rootIndex,
    root: patternRoot
  } = modeSchema;
  const { semitones } = interval(distance(patternRoot, root));
  const { intervals, notes } = getScale(scaleTitle);
  const baseOctave = +root.substr(-1);

  let octaveIncrement = 0;
  if (rootIndex !== 0) {
    octaveIncrement--;
  }

  return pattern.map(({ string, fret }, i: number) => {
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
      degree: +intervals[index][0]
    }
  });
}

export function findMode({
  modes,
  modeName
}: {
  modes: Mode[];
  modeName: string;
}): Mode {
  const found = modes.find(({ name, aliases = [] }) =>
    name === modeName || aliases.indexOf(modeName) > -1
  );
  if (!found) {
    return null;
  }
  return found;
}
