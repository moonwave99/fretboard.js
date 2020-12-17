import test from 'ava';
import { Position, Fretboard, defaultOptions } from './Fretboard';
import { Systems } from '../fretboardSystem/systems/systems';
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

test('Fretboard with custom tuning - string count mismatch', t => {
  const error = t.throws(() => {
    new Fretboard({
      tuning: ['E2', 'A2', 'D2']
    });
  });
  t.is(error.message, 'stringCount (6) and tuning size (3) do not match');
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

test('Fretboard clear', t => {
  const fretboard = new Fretboard();
  const dots = pentatonic({ box: 1, root: 'G2' });
  fretboard.render(dots);

  const svg = document.querySelector('#fretboard svg');

  t.is(svg.querySelectorAll('.dots .dot').length, dots.length);
  fretboard.clear();
  t.is(svg.querySelectorAll('.dots .dot').length, 0);
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
    .forEach(node => t.is(node.innerHTML, 'G'));

  const dotNodes = svg.querySelectorAll('.dots .dot-circle-note-G');
  dotNodes.forEach(node => t.is(node.getAttribute('fill'), 'red'));

  t.is(
    dotNodes.length,
    dots.filter(({ note }) => note === 'G').length
  );    
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
    .forEach(node => t.is(node.getAttribute('fill'), 'red'));
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
    .forEach(node => t.truthy(node.innerHTML));
});

test('Fretboard style() filter shorthand', t => {
  const fretboard = new Fretboard();
  const dots = pentatonic({ box: 1, root: 'G2' });
  fretboard.render(dots);
  fretboard.style({
    filter: ({ note: 'G' }),
    text: ({ note }) => note
  });

  const svg = document.querySelector('#fretboard svg');

  const dotNodes = svg.querySelectorAll('.dots .dot-circle-note-G');
  dotNodes.forEach(node => console.log(node.innerHTML));

  t.is(
    dotNodes.length,
    dots.filter(({ note }) => note === 'G').length
  );
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

test('Fretboard renderScale()', t => {
  const fretboard = new Fretboard({
    dotText: ({ note }: Position): string => note
  });
  fretboard.renderScale({
    scale: 'major',
    root: 'C'
  });

  const svg = document.querySelector('#fretboard svg');

  svg.querySelectorAll('.dots .dot').forEach(dot => {
    t.is('CDEFGAB'.split('').indexOf(dot.textContent) > -1, true);
  });
});

test('Fretboard renderScale() - pentatonic minor', t => {
  const fretboard = new Fretboard({
    dotText: ({ note }: Position): string => note
  });
  fretboard.renderScale({
    scale: 'minor pentatonic',
    root: 'E',
    box: 1,
    system: Systems.pentatonicMinor
  });

  const svg = document.querySelector('#fretboard svg');

  svg.querySelectorAll('.dots .dot').forEach(dot => {
    t.is('EGABD'.split('').indexOf(dot.textContent) > -1, true);
  });
});

test('Fretboard renderScale() - pentatonic major', t => {
  const fretboard = new Fretboard({
    dotText: ({ note }: Position): string => note
  });
  fretboard.renderScale({
    scale: 'major pentatonic',
    root: 'C',
    box: 1,
    system: Systems.pentatonicMajor
  });

  const svg = document.querySelector('#fretboard svg');

  svg.querySelectorAll('.dots .dot').forEach(dot => {
    t.is('CDEGA'.split('').indexOf(dot.textContent) > -1, true);
  });
});

test('Fretboard renderScale() - CAGED', t => {
  const fretboard = new Fretboard({
    dotText: ({ note }: Position): string => note
  });
  fretboard.renderScale({
    scale: 'major pentatonic',
    root: 'C',
    box: 'C',
    system: Systems.CAGED
  });

  const svg = document.querySelector('#fretboard svg');

  svg.querySelectorAll('.dots .dot').forEach(dot => {
    t.is('CDEFGAB'.split('').indexOf(dot.textContent) > -1, true);
  });
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

test('Fretboard with different stringWidths', t => {
  const stringWidth = [1, 2, 3, 4, 5, 6];
  const fretboard = new Fretboard({ stringWidth });
  fretboard.render([]);

  const svg = document.querySelector('#fretboard svg');

  t.truthy(svg);
  svg.querySelectorAll('.strings').forEach(
    (el, i) => t.is(+el.getAttribute('stroke-width'), i)
  );
});

test('Fretboard with custom classes (scalar)', t => {
  const fretboard = new Fretboard();
  const dots = pentatonic({ box: 1, root: 'G2' });
  dots[0].custom = true;
  dots[2].custom = true;
  dots[4].custom = true;
  fretboard.render(dots);

  const svg = document.querySelector('#fretboard svg');

  t.truthy(svg);
  t.is(svg.querySelectorAll('.dots .dot-custom').length, 3);
});

test('Fretboard with custom classes (array)', t => {
  const fretboard = new Fretboard();
  const dots = pentatonic({ box: 1, root: 'G2' });
  dots[0].custom = 1;
  dots[2].custom = [1, 2];
  dots[4].custom = [2];
  fretboard.render(dots);

  const svg = document.querySelector('#fretboard svg');

  t.truthy(svg);
  t.is(svg.querySelectorAll('.dots .dot-custom-1').length, 2);
  t.is(svg.querySelectorAll('.dots .dot-custom-2').length, 2);
});