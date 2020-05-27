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
  fretNumbersHeight
} = defaultOptions;

const defaultWidth =
    width
  + leftPadding
  + rightPadding;

const defaultHeight =
    height
  + topPadding
  + bottomPadding
  + fretNumbersHeight;


test.beforeEach(() => {
	browserEnv();
  document.body.innerHTML = '<div id="fretboard"></div>';
});

test('Fretboard with default options', t => {
  const fretboard = new Fretboard();
  fretboard.render([]);

  const svg = document.querySelector('#fretboard svg');

  t.truthy(svg);
  t.is(svg.getAttribute('viewBox'), `0 0 ${defaultWidth} ${defaultHeight}`);
  t.is(svg.querySelectorAll('.strings line').length, stringCount);
  t.is(svg.querySelectorAll('.frets line').length, fretCount + 1);
  t.is(svg.querySelectorAll('.fret-numbers text').length, fretCount);
});

test('Fretboard without fret numbers', t => {
  const fretboard = new Fretboard({
    showFretNumbers: false
  });
  fretboard.render();

  const svg = document.querySelector('#fretboard svg');

  t.truthy(svg);
  t.is(svg.getAttribute('viewBox'), `0 0 ${defaultWidth} ${defaultHeight - fretNumbersHeight}`);
  t.is(svg.querySelectorAll('.fret-numbers').length, 0);
});

test('Fretboard with linear frets', t => {
  const fretboard = new Fretboard({
    scaleFrets: false
  });
  fretboard.render([]);

  const svg = document.querySelector('#fretboard svg');

  t.truthy(svg);

  svg.querySelectorAll('.frets line').forEach(
    (node, i) => t.is(node.getAttribute('x1'), `${100 / fretCount * i}%`)
  );
});

test('Fretboard with dots', t => {
  const fretboard = new Fretboard();
  const dots = pentatonic({ box: 1, root: 'G2' });
  fretboard.render(dots);

  const svg = document.querySelector('#fretboard svg');

  t.truthy(svg);
  t.is(svg.getAttribute('viewBox'), `0 0 ${defaultWidth} ${defaultHeight}`);
  t.is(svg.querySelectorAll('.strings line').length, stringCount);
  t.is(svg.querySelectorAll('.frets line').length, fretCount + 1);
  t.is(svg.querySelectorAll('.fret-numbers text').length, fretCount);
  t.is(svg.querySelectorAll('.dots .dot').length, dots.length);
});

test('Fretboard with disabled dots', t => {
  const fretboard = new Fretboard();
  const dots = pentatonic({ box: 1, root: 'G2' })
    .map((dot, i) => i < 3 ? { ...dot, disabled: true } : dot);
  fretboard.render(dots);

  const svg = document.querySelector('#fretboard svg');

  t.is(svg.querySelectorAll('.dots .dot-disabled').length, 3);
});

test('Fretboard render twice', t => {
  const fretboard = new Fretboard();
  const dots = pentatonic({ box: 1, root: 'G2' });
  fretboard.render(dots);

  const svg = document.querySelector('#fretboard svg');

  t.is(svg.querySelectorAll('.dots .dot').length, dots.length);
  fretboard.render(dots);
  t.is(svg.querySelectorAll('.dots .dot').length, dots.length);
});

test('Fretboard style()', t => {
  const fretboard = new Fretboard();
  const dots = pentatonic({ box: 1, root: 'G2' });
  fretboard.render(dots);
  fretboard.style({
    filter: ({ note }) => note === 'G',
    text: ({ note }) => note,
    fill: 'red'
  });

  const svg = document.querySelector('#fretboard svg');

  svg.querySelectorAll('.dots .dot-text-note-G')
    .forEach(node => t.is(node.innerHTML, 'G'))

  svg.querySelectorAll('.dots .dot-circle-note-G')
    .forEach(node => t.is(node.getAttribute('fill'), 'red'))
});

test('Fretboard style() no text', t => {
  const fretboard = new Fretboard();
  const dots = pentatonic({ box: 1, root: 'G2' });
  fretboard.render(dots);
  fretboard.style({
    filter: ({ note }) => note === 'G',
    fill: 'red'
  });

  const svg = document.querySelector('#fretboard svg');

  svg.querySelectorAll('.dots .dot-circle-note-G')
    .forEach(node => t.is(node.getAttribute('fill'), 'red'))
});

test('Fretboard style() no filter', t => {
  const fretboard = new Fretboard();
  const dots = pentatonic({ box: 1, root: 'G2' });
  fretboard.render(dots);
  fretboard.style({
    text: ({ note }) => note
  });

  const svg = document.querySelector('#fretboard svg');

  svg.querySelectorAll('.dots .dot-text')
    .forEach(node => t.truthy(node.innerHTML))
});
