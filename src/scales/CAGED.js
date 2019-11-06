import { findMode, generateBox } from './utils';
import { boxes } from './boxes/CAGED';

const DEFAULT_ROOT_NOTE = 'C3';
const DEFAULT_MODE = 'major';
const DEFAULT_BOX = 'C';

export function CAGED ({
  mode = DEFAULT_MODE,
  root = DEFAULT_ROOT_NOTE,
  box = DEFAULT_BOX
} = {}){
  const _box = boxes[box];
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
