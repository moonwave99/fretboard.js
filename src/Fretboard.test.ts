import test from 'ava';
import { Fretboard } from './Fretboard';
import env from 'browser-env';

env();

test('Fretboard', t => {
  document.body.innerHTML = '<div id="el"></div>';

  const fretboard = new Fretboard({
    el: '#el'
  });

  t.is(!!fretboard, true);
});
