import { Position } from '../scales/scales';

export function parseChord(chord: string): {
  positions: Position[];
  mutedStrings: number[];
} {
  const positions = [] as Position[];
  const mutedStrings = [] as number[];
  chord.split('').reverse().forEach((fret, string) => {
    if (fret === '0') {
      return;
    }
    if (fret === 'x') {
      mutedStrings.push(string + 1);
      return;
    }
    positions.push({
      fret: +fret,
      string: string + 1
    });
  });
  return {
    positions,
    mutedStrings
  };
}
