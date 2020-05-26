import { findMode, generateBox } from './utils';
import { boxes as CAGEDBoxes } from './boxes/CAGED';
import { boxes as pentatonicBoxes } from './boxes/pentatonic';

export type Position = {
  string: number;
  fret: number;
  note: string;
  disabled?: boolean;
  [key: string]: string|number|boolean;
}

export type Mode = {
  name: string;
  aliases?: string[];
  root: string;
  index: number;
}

export type BoxDefinition = {
  modes: Mode[];
  pattern: {
    string: number;
    fret: number;
  }[];
}

export function pentatonic ({
  mode = 'major',
  root = 'C3',
  box = 1
} = {}): Position[] {
  const _box = pentatonicBoxes[box - 1];
  if (!_box) {
    throw new Error(`Cannot find box ${box} in the pentatonic scale`);
  }
  const { pattern, modes } = _box;
  const modeSchema = findMode({ modes, modeName: mode });
  if (!modeSchema) {
    throw new Error(`Cannot find mode ${mode} in the pentatonic ${box} box`);
  }
  return generateBox({
    name: `Pentatonic ${mode} box ${box}`,
    scaleTitle: `${root} ${mode} pentatonic`,
    pattern,
    root,
    modeSchema
  });
}

export function CAGED ({
  mode = 'major',
  root = 'C3',
  box = 'C'
} = {}): Position[] {
  const _box = (CAGEDBoxes as { [key: string]: BoxDefinition })[box];
  if (!_box) {
    throw new Error(`Cannot find box ${box} in the CAGED system`);
  }
  const { pattern, modes } = _box;
  const modeSchema = findMode({ modes, modeName: mode });
  if (!modeSchema) {
    throw new Error(`Cannot find mode ${mode} in the CAGED ${box} box`);
  }
  return generateBox({
    name: `CAGED ${box} box - ${root }${mode}`,
    scaleTitle: `${root} ${mode}`,
    pattern,
    root,
    modeSchema
  });
}
