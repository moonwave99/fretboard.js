import test from 'ava';
import {
  sliceBox,
  disableDots,
  disableStrings
} from './tools';
import { Systems, getBox } from '../fretboardSystem/systems/systems';

const box = getBox({
  mode: 'major',
  root: 'C',
  box: 'C',
  system: Systems.CAGED
});

test('disableStrings', t => {
  const output = disableStrings({
    box,
    strings: [1]
  });
  t.is(
    output
      .filter(({ string }) => string === 1)
      .every(({ disabled }) => disabled),
    true
  );
});

test('sliceBox', t => {
  const slicedBox = sliceBox({
    box,
    from: { string: 6, fret: 1 },
    to: { string: 5, fret: 2 }
  });
  t.is(slicedBox.length, 3);
});

test('sliceBox with default arguments', t => {
  const slicedBox = sliceBox({ box });
  t.is(slicedBox.length, box.length);
});

test('sliceBox with wrong lower bound', t => {
  const slicedBox = sliceBox({
    box,
    from: { string: 6, fret: 2 },
    to: { string: 5, fret: 2 }
  });
  t.is(slicedBox.length, 4);
});

test('sliceBox with wrong upper bound', t => {
  const slicedBox = sliceBox({
    box,
    from: { string: 6, fret: 0 },
    to: { string: 0, fret: 0 }
  });
  t.is(slicedBox.length, box.length);
});

test('disableDots', t => {
  const disabledBox = disableDots({
    box,
    from: { string: 6, fret: 0 },
    to: { string: 6, fret: 2 }
  });
  t.is(disabledBox.filter(({ disabled }) => disabled ).length, 2);
});

test('disableDots with default arguments', t => {
  const disabledBox = disableDots({ box });
  t.is(disabledBox.filter(({ disabled }) => disabled ).length, box.length);
});

test('disableDots just one string', t => {
  const disabledBox = disableDots({
    box,
    from: { string: 4, fret: 0 },
    to: { string: 4, fret: 3 }
  });
  t.is(
    disabledBox.filter(({ disabled }) => disabled ).length,
    box.filter(( { string }) => string === 4).length
  );
});
