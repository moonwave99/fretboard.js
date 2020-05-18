import test from 'ava';
import { pentatonic, CAGED } from './scales';

test('pentatonic with default options', t => {
  const box = pentatonic();
  t.is(box.length, 12);
  t.is(box[0].note, 'C');
});

test('pentatonic with unexisting box', t => {
  t.throws(() => {
    pentatonic({
      box: 666
    });
  });
});

test('pentatonic with unexisting mode', t => {
  t.throws(() => {
    pentatonic({
      mode: 'hawaiian'
    });
  });
});

test('CAGED with default options', t => {
  const box = CAGED();
  t.is(box.length, 17);
  t.is(box[0].note, 'E');
});

test('CAGED with unexisting box', t => {
  t.throws(() => {
    CAGED({
      box: 'F'
    });
  });
});

test('CAGED with unexisting mode', t => {
  t.throws(() => {
    CAGED({
      mode: 'hawaiian'
    });
  });
});
