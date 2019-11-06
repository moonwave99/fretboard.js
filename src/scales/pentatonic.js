import { findMode, generateBox } from './utils';
import { boxes } from './boxes/pentatonic';

export function pentatonic ({
  mode = 'major',
  root = 'C3',
  box = 1
} = {}){
  const _box = boxes[box - 1];
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
