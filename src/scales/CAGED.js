import { findMode, generateBox } from './utils';
import { boxes } from './boxes/CAGED';

export function CAGED ({
  mode = 'major',
  root = 'C3',
  box = 'C'
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
