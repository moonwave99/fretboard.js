import test from 'ava';
import { pentatonic, CAGED, TNPString } from './scales';

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

test('3NPS with default options', t => {
  const box = TNPString();
  t.is(box.length, 18);
  t.is(box[0].note, 'E');
  t.is(box[17].note, 'A');
});

test('3NPS with unexisting box', t => {
  t.throws(() => {
    TNPString({
      box: 666
    });
  });
});

test('3NPS with box 1, dorian mode', t => {
  const box = TNPString({
    mode: 'dorian',
    root: 'A2',
    box: 1
  });
  t.is(box.length, 18);
  t.is(box[0].note, 'G');
  t.is(box[6].note, 'F#');
  t.is(box[17].note, 'C');
});

test('3NPS with box 2, dorian mode', t => {
  const box = TNPString({
    mode: 'dorian',
    root: 'A2',
    box: 2
  });
  t.is(box.length, 18);
  t.is(box[0].note, 'A');
  t.is(box[5].note, 'F#');
  t.is(box[17].note, 'D');
});

test('3NPS with unexisting mode', t => {
  t.throws(() => {
    TNPString({
      mode: 'hawaiian'
    });
  });
});
