import test from 'ava';
import { Position, Fretboard, defaultOptions } from './Fretboard';
import { Systems } from '../fretboardSystem/systems/systems';
import { FretboardSystem } from '../fretboardSystem/FretboardSystem';
import { GUITAR_TUNINGS } from '../constants';
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

const system = new FretboardSystem();
const pentaDots = system.getScale({
  root: 'G',
  type: 'minor pentatonic',
  box: {
    system: Systems.pentatonic,
    box: 1
  }
});

test('Fretboard with default options', t => {
  const fretboard = new Fretboard();
  fretboard.render();

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
  fretboard.render();

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
  fretboard.render();

  const svg = document.querySelector('#fretboard svg');

  t.truthy(svg);

  svg.querySelectorAll('.frets line').forEach(
    (node, i) => t.is(node.getAttribute('x1'), `${100 / fretCount * i}%`)
  );
});

test('Fretboard with dots', t => {
  const fretboard = new Fretboard();
  fretboard.renderScale({
    root: 'G2',
    type: 'minor pentatonic',
    box: {
      system: Systems.pentatonic,
      box: 1
    }
  });

  const svg = document.querySelector('#fretboard svg');

  t.truthy(svg);
  t.is(svg.getAttribute('viewBox'), `0 0 ${defaultWidth} ${defaultHeight}`);
  t.is(svg.querySelectorAll('.strings line').length, stringCount);
  t.is(svg.querySelectorAll('.frets line').length, fretCount + 1);
  t.is(svg.querySelectorAll('.fret-numbers text').length, fretCount);
  t.is(svg.querySelectorAll('.dots .dot').length, 42);
});


test('Fretboard with cropping', t => {
  const dots = system.getScale({
    root: 'C',
    type: 'minor pentatonic',
    box: {
      system: Systems.pentatonic,
      box: 1
    }
  }).filter(({ inBox }) => inBox);
  new Fretboard({
    scaleFrets: false,
    fretCount: 4,
    crop: true
  }).setDots(dots).render();

  const svg = document.querySelector('#fretboard svg');
  t.truthy(svg);
  t.is(svg.getAttribute('viewBox'), `0 0 ${defaultWidth} ${defaultHeight}`);
  t.deepEqual(
    Array.from(svg.querySelectorAll('.fret-numbers text')).map(x => x.innerHTML),
    ['8', '9', '10', '11']
  );
});

test('Fretboard render twice', t => {
  const fretboard = new Fretboard();
  fretboard.setDots(pentaDots).render();

  const svg = document.querySelector('#fretboard svg');

  t.is(svg.querySelectorAll('.dots .dot').length, pentaDots.length);
  fretboard.setDots(pentaDots).render();
  t.is(svg.querySelectorAll('.dots .dot').length, pentaDots.length);
});

test('Fretboard render dot less than fret count', t => {
  const fretboard = new Fretboard({ fretCount: 12 });
  fretboard.setDots([{ fret: 11, string: 1 }]).render();

  const svg = document.querySelector('#fretboard svg');

  t.is(svg.querySelectorAll('.dots .dot').length, 1);
});

test('Fretboard render dot equal to fret count', t => {
  const fretboard = new Fretboard({ fretCount: 12 });
  fretboard.setDots([{ fret: 12, string: 1 }]).render();

  const svg = document.querySelector('#fretboard svg');

  t.is(svg.querySelectorAll('.dots .dot').length, 1);
});

test('Fretboard render dot greater than fret count', t => {
  const fretboard = new Fretboard({ fretCount: 12 });
  fretboard.setDots([{ fret: 13, string: 1 }]).render();

  const svg = document.querySelector('#fretboard svg');

  t.is(svg.querySelectorAll('.dots .dot').length, 0);
});

test('Fretboard clear', t => {
  const fretboard = new Fretboard();
  fretboard.setDots(pentaDots).render();

  const svg = document.querySelector('#fretboard svg');

  t.is(svg.querySelectorAll('.dots .dot').length, pentaDots.length);
  fretboard.clear();
  t.is(svg.querySelectorAll('.dots .dot').length, 0);
});

test('Fretboard style()', t => {
  const fretboard = new Fretboard();
  fretboard.setDots(pentaDots).render();
  fretboard.style({
    filter: ({ note }) => note === 'G',
    text: ({ note }) => note,
    fill: 'red'
  });

  const svg = document.querySelector('#fretboard svg');
  svg.querySelectorAll('.dots .dot-note-G .dot-text')
    .forEach(node => t.is(node.innerHTML, 'G'));

  const dotNodes = svg.querySelectorAll('.dots .dot-note-G .dot-circle');
  dotNodes.forEach(node => t.is(node.getAttribute('fill'), 'red'));

  t.is(
    dotNodes.length,
    pentaDots.filter(({ note }) => note === 'G').length
  );
});

test('Fretboard style() no text', t => {
  const fretboard = new Fretboard();
  fretboard.setDots(pentaDots).render();
  fretboard.style({
    filter: ({ note }) => note === 'G',
    fill: 'red'
  });

  const svg = document.querySelector('#fretboard svg');

  svg.querySelectorAll('.dots .dot-note-G .dot-circle')
    .forEach(node => t.is(node.getAttribute('fill'), 'red'));
});

test('Fretboard style() no filter', t => {
  const fretboard = new Fretboard();
  fretboard.setDots(pentaDots).render();
  fretboard.style({
    text: ({ note }) => note
  });

  const svg = document.querySelector('#fretboard svg');

  svg.querySelectorAll('.dots .dot-text')
    .forEach(node => t.truthy(node.innerHTML));
});

test('Fretboard style() filter shorthand', t => {
  const fretboard = new Fretboard();
  fretboard.setDots(pentaDots).render();
  fretboard.style({
    filter: ({ note: 'G' }),
    text: ({ note }) => note
  });

  const svg = document.querySelector('#fretboard svg');

  const dotNodes = svg.querySelectorAll('.dots .dot-note-G .dot-circle');
  dotNodes.forEach(node => console.log(node.innerHTML));

  t.is(
    dotNodes.length,
    pentaDots.filter(({ note }) => note === 'G').length
  );
});

test('Fretboard muteStrings()', t => {
  const fretboard = new Fretboard();
  fretboard.render();
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

test('Fretboard renderChord() - above 9th fret', t => {
  const fretboard = new Fretboard();
  fretboard.renderChord('10-x-10-10-8-x');

  const svg = document.querySelector('#fretboard svg');

  t.is(svg.querySelectorAll('.muted-strings .muted-string').length, 2);
  t.is(svg.querySelectorAll('.dots .dot').length, 4);
});

test('Fretboard renderChord() - barres', t => {
  const fretboard = new Fretboard();
  fretboard.renderChord('133211', { fret: 1 });

  const svg = document.querySelector('#fretboard svg');

  t.is(svg.querySelectorAll('.barres rect').length, 1);
});

test('Fretboard renderChord() - multiple barres', t => {
  const fretboard = new Fretboard();
  fretboard.renderChord('x35553', [
    { fret: 3, stringFrom: 5 },
    { fret: 5, stringFrom: 4, stringTo: 2 }
  ]);

  const svg = document.querySelector('#fretboard svg');

  t.is(svg.querySelectorAll('.barres rect').length, 2);
});

test('Fretboard renderTriad()', t => {
  const fretboard = new Fretboard();
  fretboard.renderTriad('C');
  const svg = document.querySelector('#fretboard svg');
  t.is(svg.querySelectorAll('.dots .dot').length, 3);
});

test('Fretboard renderTriad() - minor type', t => {
  const fretboard = new Fretboard();
  fretboard.renderTriad('Cm');
  const svg = document.querySelector('#fretboard svg');
  t.is(svg.querySelectorAll('.dots .dot').length, 3);
});

test('Fretboard renderBox()', t => {
  const fretboard = new Fretboard({
    dotText: ({ note }: Position): string => note
  });
  fretboard.renderBox({
    type: 'minor',
    root: 'E',
    box: {
      system: Systems.pentatonic,
      box: 1
    }
  });

  const svg = document.querySelector('#fretboard svg');
  const dots = svg.querySelectorAll('.dots .dot');
  dots.forEach(dot => {
    t.is('EGABD'.split('').indexOf(dot.textContent) > -1, true);
  });
  t.is(dots.length, 12);
});

test('Fretboard renderBox() - custom tuning warning', t => {
  const fretboard = new Fretboard({
    tuning: GUITAR_TUNINGS.openG
  }).renderBox({
    type: 'major pentatonic',
    root: 'C',
    box: {
      system: Systems.CAGED,
      box: 'C'
    }
  });
  t.is(fretboard instanceof Fretboard, true);
});

test('Fretboard renderScale()', t => {
  const fretboard = new Fretboard({
    dotText: ({ note }: Position): string => note
  });
  fretboard.renderScale({
    type: 'major',
    root: 'C'
  });

  const svg = document.querySelector('#fretboard svg');

  svg.querySelectorAll('.dots .dot').forEach(dot =>
    t.is('CDEFGAB'.split('').indexOf(dot.textContent) > -1, true)
  );
});

test('Fretboard renderScale() - pentatonic', t => {
  const fretboard = new Fretboard({
    dotText: ({ note }: Position): string => note
  });
  fretboard.renderScale({
    type: 'minor pentatonic',
    root: 'E',
    box: {
      system: Systems.pentatonic,
      box: 1
    }
  });

  const svg = document.querySelector('#fretboard svg');

  svg.querySelectorAll('.dots .dot').forEach(dot =>
    t.is('EGABD'.split('').indexOf(dot.textContent) > -1, true)
  );
});

test('Fretboard renderScale() - CAGED', t => {
  const fretboard = new Fretboard({
    dotText: ({ note }: Position): string => note
  });
  fretboard.renderScale({
    type: 'major pentatonic',
    root: 'C',
    box: {
      system: Systems.CAGED,
      box: 'C'
    }
  });

  const svg = document.querySelector('#fretboard svg');

  svg.querySelectorAll('.dots .dot').forEach(dot =>
    t.is('CDEFGAB'.split('').indexOf(dot.textContent) > -1, true)
  );
});

test('Fretboard renderScale() - TNPS', t => {
  const fretboard = new Fretboard({
    dotText: ({ note }: Position): string => note
  });
  fretboard.renderScale({
    type: 'major pentatonic',
    root: 'C',
    box: {
      system: Systems.TNPS,
      box: 1
    }
  });

  const svg = document.querySelector('#fretboard svg');

  svg.querySelectorAll('.dots .dot').forEach(dot =>
    t.is('CDEFGAB'.split('').indexOf(dot.textContent) > -1, true)
  );
});

test('Fretboard renderScale() - custom tuning warning', t => {
  const fretboard = new Fretboard({
    tuning: GUITAR_TUNINGS.openG
  }).renderScale({
    type: 'major pentatonic',
    root: 'C',
    box: {
      system: Systems.CAGED,
      box: 'C'
    }
  });
  t.is(fretboard instanceof Fretboard, true);
});

test('Fretboard event handlers', t => {
  new Fretboard()
    .render()
    .on('click', (position: Position) => t.deepEqual(position, { string: 1, fret: 0, note: 'E' }));
  const hoverDiv = document.querySelector('#fretboard .hoverDiv');
  t.truthy(hoverDiv);
  hoverDiv.dispatchEvent(new MouseEvent('click'));
});

test('Fretboard add new event listener', t => {
  let count = 0;
  const handler = (): void => { count++ };
  const fretboard = new Fretboard()
    .render()
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
    .render()
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
    .render()
    .removeEventListeners();
  const svg = document.querySelector('#fretboard svg');
  t.truthy(svg);
});

test('Fretboard event handlers - click on dot', t => {
  new Fretboard()
    .setDots([{ string: 1, fret: 0 }])
    .render()
    .on('click', (position: Position) => t.deepEqual(position, { string: 1, fret: 0, note: 'E' }));
  const hoverDiv = document.querySelector('#fretboard .hoverDiv');
  t.truthy(hoverDiv);
  hoverDiv.dispatchEvent(new MouseEvent('click'));
});

test('Fretboard with different stringWidths', t => {
  const stringWidth = [1, 2, 3, 4, 5, 6];
  const fretboard = new Fretboard({ stringWidth });
  fretboard.render();

  const svg = document.querySelector('#fretboard svg');

  t.truthy(svg);
  svg.querySelectorAll('.strings').forEach(
    (el, i) => t.is(+el.getAttribute('stroke-width'), i)
  );
});

test('Fretboard with custom classes (scalar)', t => {
  const fretboard = new Fretboard();
  const dots = system.getScale({
    root: 'G',
    type: 'minor pentatonic',
    box: {
      system: Systems.pentatonic,
      box: 1
    }
  });
  dots[0].custom = true;
  dots[2].custom = true;
  dots[4].custom = true;
  fretboard.setDots(dots).render();

  const svg = document.querySelector('#fretboard svg');

  t.truthy(svg);
  t.is(svg.querySelectorAll('.dots .dot-custom').length, 3);
});

test('Fretboard with custom classes (array)', t => {
  const fretboard = new Fretboard();
  const dots = system.getScale({
    root: 'G',
    type: 'minor pentatonic',
    box: {
      system: Systems.pentatonic,
      box: 1
    }
  });
  dots[0].custom = 1;
  dots[2].custom = [1, 2];
  dots[4].custom = [2];
  fretboard.setDots(dots).render();

  const svg = document.querySelector('#fretboard svg');

  t.truthy(svg);
  t.is(svg.querySelectorAll('.dots .dot-custom-1').length, 2);
  t.is(svg.querySelectorAll('.dots .dot-custom-2').length, 2);
});