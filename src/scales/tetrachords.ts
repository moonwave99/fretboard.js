import { Position } from './scales';
import { interval } from '@tonaljs/tonal';
import { transpose } from '@tonaljs/note';

export enum TetrachordTypes {
  Major = 'Major',
  Minor = 'Minor',
  Phrygian = 'Phrygian',
  Harmonic = 'Harmonic',
  Lydian = 'Lydian'
}

export enum TetrachordLayouts {
  Linear,
  ThreePlusOne,
  TwoPlusTwo,
  OnePlusThree
}

const Tetrachords = {
  [TetrachordTypes.Major]: ['M2', 'M2', 'm2'],
  [TetrachordTypes.Minor]: ['M2', 'm2', 'M2'],
  [TetrachordTypes.Phrygian]: ['m2', 'M2', 'M2'],
  [TetrachordTypes.Harmonic]: ['m2', 'A2', 'm2'],
  [TetrachordTypes.Lydian]: ['M2', 'M2', 'M2']
}

type TetrachordArgs = {
  root: string;
  type: TetrachordTypes;
  layout: TetrachordLayouts;
  string: number;
  fret: number;
};

export function tetrachord({
  root,
  type,
  layout,
  string,
  fret
}: TetrachordArgs = {
  root: 'E',
  type: TetrachordTypes.Major,
  layout: TetrachordLayouts.Linear,
  string: 6,
  fret: 0
}): Position[] {
  const tetrachord = Tetrachords[type];
  const pattern = [{
    string,
    fret,
    note: root
  }];

  let partial = 0;
  let currentNote = root;
  if (layout === TetrachordLayouts.Linear) {
    tetrachord.forEach(x => {
      const { semitones } = interval(x);
      currentNote = transpose(currentNote, x);
      partial += semitones;
      pattern.push({
        string,
        fret: fret + partial,
        note: currentNote
      });
    });
    return pattern;
  }

  if (string === 1) {
    throw new Error('Cannot split a tetrachord over two strings if starting on the first one');
  }

  let currentString = string;

  const splitIndex = ((): number => {
    switch(layout) {
      case TetrachordLayouts.ThreePlusOne:
        return 2;
      case TetrachordLayouts.TwoPlusTwo:
        return 1;
      case TetrachordLayouts.OnePlusThree:
        return 0;
    }
  })();

  tetrachord.forEach((x, i) => {
    const { semitones } = interval(x);
    currentNote = transpose(currentNote, x);
    if (i === splitIndex) {
      currentString -= 1;
      partial = currentString === 2
        ? partial - 4
        : partial - 5;
    }
    partial += semitones;

    const currentFret = fret + partial;

    if (currentFret < 0) {
      throw new Error('Cannot use this layout from this starting fret');
    }

    pattern.push({
      string: currentString,
      fret: currentFret,
      note: currentNote
    });
  });

  return pattern;
}
