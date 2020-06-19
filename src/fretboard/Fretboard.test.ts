import test from 'ava';
import { Position, Fretboard, defaultOptions } from './Fretboard';
import { pentatonic } from '../scales/scales';
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

test('Fretboard with existing DOM element', t => {
  const el = document.createElement('div');
  el.id = 'fretboard';
  document.body.append(el);
  const fretboard = new Fretboard({ el });
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


test('Fretboard with cropping', t => {
  const fretboard = new Fretboard({
    scaleFrets: false,
    fretCount: 4,
    crop: true
  });
  const dots = pentatonic({ box: 1, root: 'C3' });
  fretboard.render(dots);

  const svg = document.querySelector('#fretboard svg');
  t.truthy(svg);
  t.is(svg.getAttribute('viewBox'), `0 0 ${defaultWidth} ${defaultHeight}`);
  t.deepEqual(
    Array.from(svg.querySelectorAll('.fret-numbers text')).map(x => x.innerHTML),
    [ '7', '8', '9', '10' ]
  );
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

test('Fretboard muteStrings()', t => {
  const fretboard = new Fretboard();
  fretboard.render([]);
  fretboard.muteStrings({
    strings: [6, 1]
  });

  const svg = document.querySelector('#fretboard svg');

  t.is(svg.querySelectorAll('.muted-strings .muted-string').length, 2);
});

test('Fretboard renderChord()', t => {
  const fretboard = new Fretboard();
  fretboard.renderChord('x32010');

  const svg = document.querySelector('#fretboard svg');

  t.is(svg.querySelectorAll('.muted-strings .muted-string').length, 1);
  t.is(svg.querySelectorAll('.dots .dot').length, 3);
});

test('Fretboard renderChord() above 9th fret', t => {
  const fretboard = new Fretboard();
  fretboard.renderChord('10-x-10-10-8-x');

  const svg = document.querySelector('#fretboard svg');

  t.is(svg.querySelectorAll('.muted-strings .muted-string').length, 2);
  t.is(svg.querySelectorAll('.dots .dot').length, 4);
});

test('Fretboard event handlers', t => {
  new Fretboard()
    .render([])
    .on('click', (position: Position) => t.deepEqual(position, { string: 1, fret: 0 }));
  const hoverDiv = document.querySelector('#fretboard .hoverDiv');
  hoverDiv.dispatchEvent(new MouseEvent('click'));
  t.truthy(hoverDiv);
});

test('Fretboard add new event listener', t => {
  let count = 0;
  const handler = (): void => { count++ };
  const fretboard = new Fretboard()
    .render([])
    .on('click', handler);
  const hoverDiv = document.querySelector('#fretboard .hoverDiv');
  hoverDiv.dispatchEvent(new MouseEvent('click'));
  t.is(count, 1);

  fretboard.on('click', () => true);
  hoverDiv.dispatchEvent(new MouseEvent('click'));
  t.is(count, 1);
});

test('Fretboard removeEventListeners', t => {
  let count = 0;
  const handler = (): void => { count++ };
  const fretboard = new Fretboard()
    .render([])
    .on('click', handler);
  const hoverDiv = document.querySelector('#fretboard .hoverDiv');
  hoverDiv.dispatchEvent(new MouseEvent('click'));
  t.is(count, 1);

  fretboard.removeEventListeners();
  hoverDiv.dispatchEvent(new MouseEvent('click'));
  t.is(count, 1);
});

test('Fretboard removeEventListeners before adding listeners', t => {
  new Fretboard()
    .render([])
    .removeEventListeners();
  const svg = document.querySelector('#fretboard svg');

  t.truthy(svg);
});
