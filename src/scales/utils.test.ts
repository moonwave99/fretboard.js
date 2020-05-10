import test from 'ava';
import { findMode } from './utils';

const modes= [{
  name: 'ionian',
  aliases: ['major'],
  root: 'E2',
  index: 1
},
{
  name: 'dorian',
  root: 'F#2',
  index: 2
}];

test('findMode', t => {
  const found = findMode({ modes, modeName: 'ionian' });
  t.deepEqual(modes[0], found);
});

test('findMode not found', t => {
  const found = findMode({ modes, modeName: 'hawaiian' });
  t.is(found, null);
});

test('findMode with alias', t => {
  const found = findMode({ modes, modeName: 'ionian' });
  const aliased = findMode({ modes, modeName: 'major' });
  t.is(found, aliased);
});
