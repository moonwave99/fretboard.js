import test from 'ava';
import { tetrachord, TetrachordTypes, TetrachordLayouts } from './tetrachords';

test('tetrachord with default arguments', t => {
  const tetra = tetrachord();
  t.deepEqual(tetra, [
    { string: 6, fret: 0, note: 'E' },
    { string: 6, fret: 2, note: 'F#' },
    { string: 6, fret: 4, note: 'G#' },
    { string: 6, fret: 5, note: 'A' }
  ]);
});

test('tetrachord - major linear', t => {
  const tetra = tetrachord({
    type: TetrachordTypes.Major,
    layout: TetrachordLayouts.Linear,
    string: 6,
    fret: 0,
    root: 'E'
  });
  t.deepEqual(tetra, [
    { string: 6, fret: 0, note: 'E' },
    { string: 6, fret: 2, note: 'F#' },
    { string: 6, fret: 4, note: 'G#' },
    { string: 6, fret: 5, note: 'A' }
  ]);
});

test('tetrachord - minor linear', t => {
  const tetra = tetrachord({
    type: TetrachordTypes.Minor,
    layout: TetrachordLayouts.Linear,
    string: 6,
    fret: 0,
    root: 'E'
  });
  t.deepEqual(tetra, [
    { string: 6, fret: 0, note: 'E' },
    { string: 6, fret: 2, note: 'F#' },
    { string: 6, fret: 3, note: 'G' },
    { string: 6, fret: 5, note: 'A' }
  ]);
});

test('tetrachord - major ThreePlusOne', t => {
  const tetra = tetrachord({
    type: TetrachordTypes.Major,
    layout: TetrachordLayouts.ThreePlusOne,
    string: 6,
    fret: 0,
    root: 'E'
  });
  t.deepEqual(tetra, [
    { string: 6, fret: 0, note: 'E' },
    { string: 6, fret: 2, note: 'F#' },
    { string: 6, fret: 4, note: 'G#' },
    { string: 5, fret: 0, note: 'A' }
  ]);
});

test('tetrachord - minor ThreePlusOne', t => {
  const tetra = tetrachord({
    type: TetrachordTypes.Minor,
    layout: TetrachordLayouts.ThreePlusOne,
    string: 6,
    fret: 0,
    root: 'E'
  });
  t.deepEqual(tetra, [
    { string: 6, fret: 0, note: 'E' },
    { string: 6, fret: 2, note: 'F#' },
    { string: 6, fret: 3, note: 'G' },
    { string: 5, fret: 0, note: 'A' }
  ]);
});

test('tetrachord - major TwoPlusTwo', t => {
  const tetra = tetrachord({
    type: TetrachordTypes.Major,
    layout: TetrachordLayouts.TwoPlusTwo,
    string: 6,
    fret: 3,
    root: 'G'
  });
  t.deepEqual(tetra, [
    { string: 6, fret: 3, note: 'G' },
    { string: 6, fret: 5, note: 'A' },
    { string: 5, fret: 2, note: 'B' },
    { string: 5, fret: 3, note: 'C' }
  ]);
});

test('tetrachord - minor TwoPlusTwo', t => {
  const tetra = tetrachord({
    type: TetrachordTypes.Minor,
    layout: TetrachordLayouts.TwoPlusTwo,
    string: 6,
    fret: 3,
    root: 'G'
  });
  t.deepEqual(tetra, [
    { string: 6, fret: 3, note: 'G' },
    { string: 6, fret: 5, note: 'A' },
    { string: 5, fret: 1, note: 'Bb' },
    { string: 5, fret: 3, note: 'C' }
  ]);
});

test('tetrachord - major TwoPlusTwo - 3rd string', t => {
  const tetra = tetrachord({
    type: TetrachordTypes.Major,
    layout: TetrachordLayouts.TwoPlusTwo,
    string: 3,
    fret: 3,
    root: 'Bb'
  });
  t.deepEqual(tetra, [
    { string: 3, fret: 3, note: 'Bb' },
    { string: 3, fret: 5, note: 'C' },
    { string: 2, fret: 3, note: 'D' },
    { string: 2, fret: 4, note: 'Eb' }
  ]);
});

test('tetrachord - minor TwoPlusTwo - 3rd string', t => {
  const tetra = tetrachord({
    type: TetrachordTypes.Minor,
    layout: TetrachordLayouts.TwoPlusTwo,
    string: 3,
    fret: 3,
    root: 'Bb'
  });
  t.deepEqual(tetra, [
    { string: 3, fret: 3, note: 'Bb' },
    { string: 3, fret: 5, note: 'C' },
    { string: 2, fret: 2, note: 'Db' },
    { string: 2, fret: 4, note: 'Eb' }
  ]);
});

test('tetrachord - major OnePlusThree', t => {
  const tetra = tetrachord({
    type: TetrachordTypes.Major,
    layout: TetrachordLayouts.OnePlusThree,
    string: 6,
    fret: 5,
    root: 'A'
  });
  t.deepEqual(tetra, [
    { string: 6, fret: 5, note: 'A' },
    { string: 5, fret: 2, note: 'B' },
    { string: 5, fret: 4, note: 'C#' },
    { string: 5, fret: 5, note: 'D' }
  ]);
});

test('tetrachord - minor OnePlusThree', t => {
  const tetra = tetrachord({
    type: TetrachordTypes.Minor,
    layout: TetrachordLayouts.OnePlusThree,
    string: 6,
    fret: 5,
    root: 'A'
  });
  t.deepEqual(tetra, [
    { string: 6, fret: 5, note: 'A' },
    { string: 5, fret: 2, note: 'B' },
    { string: 5, fret: 3, note: 'C' },
    { string: 5, fret: 5, note: 'D' }
  ]);
});

test('tetrachord - major OnePlusThree - 3rd string', t => {
  const tetra = tetrachord({
    type: TetrachordTypes.Major,
    layout: TetrachordLayouts.OnePlusThree,
    string: 3,
    fret: 5,
    root: 'C'
  });
  t.deepEqual(tetra, [
    { string: 3, fret: 5, note: 'C' },
    { string: 2, fret: 3, note: 'D' },
    { string: 2, fret: 5, note: 'E' },
    { string: 2, fret: 6, note: 'F' }
  ]);
});

test('tetrachord - minor OnePlusThree - 3rd string', t => {
  const tetra = tetrachord({
    type: TetrachordTypes.Minor,
    layout: TetrachordLayouts.OnePlusThree,
    string: 3,
    fret: 5,
    root: 'C'
  });
  t.deepEqual(tetra, [
    { string: 3, fret: 5, note: 'C' },
    { string: 2, fret: 3, note: 'D' },
    { string: 2, fret: 4, note: 'Eb' },
    { string: 2, fret: 6, note: 'F' }
  ]);
});

test('tetrachord - lydian ThreePlusOne', t => {
  const tetra = tetrachord({
    type: TetrachordTypes.Lydian,
    layout: TetrachordLayouts.ThreePlusOne,
    string: 6,
    fret: 5,
    root: 'A'
  });
  t.deepEqual(tetra, [
    { string: 6, fret: 5, note: 'A' },
    { string: 6, fret: 7, note: 'B' },
    { string: 6, fret: 9, note: 'C#' },
    { string: 5, fret: 6, note: 'D#' }
  ]);
});

test('tetrachord - lydian TwoPlusTwo', t => {
  const tetra = tetrachord({
    type: TetrachordTypes.Lydian,
    layout: TetrachordLayouts.TwoPlusTwo,
    string: 6,
    fret: 5,
    root: 'A'
  });
  t.deepEqual(tetra, [
    { string: 6, fret: 5, note: 'A' },
    { string: 6, fret: 7, note: 'B' },
    { string: 5, fret: 4, note: 'C#' },
    { string: 5, fret: 6, note: 'D#' }
  ]);
});

test('tetrachord - first string, multiple string layout', t => {
  const error = t.throws(() => {
    tetrachord({
      type: TetrachordTypes.Major,
      layout: TetrachordLayouts.ThreePlusOne,
      string: 1,
      fret: 5,
      root: 'A'
    });
  });
  t.is(error.message, 'Cannot split a tetrachord over two strings if starting on the first one');
});

test('tetrachord - fret out of bounds, multiple string layout', t => {
  const error = t.throws(() => {
    tetrachord({
      type: TetrachordTypes.Major,
      layout: TetrachordLayouts.OnePlusThree,
      string: 3,
      fret: 0,
      root: 'G'
    });
  });
  t.is(error.message, 'Cannot use this layout from this starting fret');
});
