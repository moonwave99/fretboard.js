import test from 'ava';
import { Fretboard, defaultOptions } from './Fretboard';
import { pentatonic } from './scales/scales';
import browserEnv from 'browser-env';

const {
  stringCount,
  fretCount,
  width,
  height,
  topPadding,
  bottomPadding,
  leftPadding,
  rightPadding,
  fretsNumberHeight
} = defaultOptions;

const defaultWidth =
    width
  + leftPadding
  + rightPadding;

const defaultHeight =
    height
  + topPadding
  + bottomPadding
  + fretsNumberHeight;


test.beforeEach(() => {
	browserEnv();
  document.body.innerHTML = '<div id="el"></div>';
});

test('Fretboard with default options', t => {
  const fretboard = new Fretboard({ el: '#el' });
  fretboard.render([]);

  const svg = document.querySelector('#el svg');

  t.truthy(svg);
  t.is(svg.getAttribute('viewBox'), `0 0 ${defaultWidth} ${defaultHeight}`);
  t.is(svg.querySelectorAll('.strings line').length, stringCount);
  t.is(svg.querySelectorAll('.frets line').length, fretCount + 1);
  t.is(svg.querySelectorAll('.fret-numbers text').length, fretCount);
});

test('Fretboard with dots', t => {
  const fretboard = new Fretboard({ el: '#el' });
  const dots = pentatonic({ box: 1, root: 'G2' });
  fretboard.render(dots);

  const svg = document.querySelector('#el svg');

  t.truthy(svg);
  t.is(svg.getAttribute('viewBox'), `0 0 ${defaultWidth} ${defaultHeight}`);
  t.is(svg.querySelectorAll('.strings line').length, stringCount);
  t.is(svg.querySelectorAll('.frets line').length, fretCount + 1);
  t.is(svg.querySelectorAll('.fret-numbers text').length, fretCount);
  t.is(svg.querySelectorAll('.dots .dot').length, dots.length);
});

test('Fretboard render twice', t => {
  const fretboard = new Fretboard({ el: '#el' });
  const dots = pentatonic({ box: 1, root: 'G2' });
  fretboard.render(dots);

  const svg = document.querySelector('#el svg');
  
  t.is(svg.querySelectorAll('.dots .dot').length, dots.length);
  fretboard.render(dots);
  t.is(svg.querySelectorAll('.dots .dot').length, dots.length);
});
