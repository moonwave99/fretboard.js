import test from 'ava';

import { FretboardSystem, isPositionInBox, TriadTypes, TriadLayouts, TriadInversions } from './FretboardSystem';
import {
    GUITAR_TUNINGS,
    DEFAULT_FRET_COUNT
} from '../constants';

import { Systems } from './systems/systems';

test('FretboardSystem - constructor with default options', t => {
    const system = new FretboardSystem();
    t.is(system instanceof FretboardSystem, true);
    t.is(system.getTuning(), GUITAR_TUNINGS.default);
    t.is(system.getFretCount(), DEFAULT_FRET_COUNT);
});

test('FretboardSystem - constructor with custom options', t => {
    const customParams = {
        tuning: ['G2', 'B2', 'D3', 'G3', 'B3', 'D4'],
        fretCount: 12
    };
    const system = new FretboardSystem(customParams);
    t.is(system instanceof FretboardSystem, true);
    t.is(system.getTuning(), customParams.tuning);
    t.is(system.getFretCount(), customParams.fretCount);
});

test('FretboardSystem - getScale()', t => {
    const system = new FretboardSystem();
    const scale = system.getScale({
        type: 'minor pentatonic',
        root: 'E'
    });
    t.deepEqual(scale[0], {
        octave: 4,
        octaveInScale: 2,
        chroma: 4,
        note: 'E',
        interval: '1P',
        degree: 1,
        string: 1,
        fret: 0
    });
});

test('FretboardSystem - getScale() - scale not found', t => {
    const system = new FretboardSystem();
    const error = t.throws(() => {
        system.getScale({
            type: 'augmented pentatronic',
            root: 'H'
        });
    });
    t.is(error.message, 'Cannot find scale: H augmented pentatronic');
});

test('FretboardSystem - getScale() with system', t => {
    const system = new FretboardSystem();
    const scale = system.getScale({
        type: 'minor pentatonic',
        root: 'E',
        box: {
            system: Systems.pentatonic,
            box: 1
        }
    });
    t.is(
        scale.filter(({ inBox }) => inBox).length,
        12
    );
});

test('FretboardSystem - getScale() with system - upper octave', t => {
    const system = new FretboardSystem();
    const scale = system.getScale({
        type: 'minor pentatonic',
        root: 'E3',
        box: {
            system: Systems.pentatonic,
            box: 1
        }
    });
    t.is(isPositionInBox({ string: 6, fret: 12 }, scale), true);
});

test('FretboardSystem - getScale() - B#', t => {
    const system = new FretboardSystem({ fretCount: 12 });
    const scale = system.getScale({ root: 'B#', type: 'major' });
    scale
        .map(({ note, octave }, index) => note === 'B#' ? { octave, index } : null)
        .filter(x => !!x)
        .forEach(({ octave, index }) => {
            const { octave: nextOctave, fret } = scale[index + 1];
            if (!nextOctave || fret === 0 || fret === 12) {
                return;
            }
            t.is(octave, (nextOctave as number) - 1);
        })
});

test('FretboardSystem - getScale() - Cb', t => {
    const system = new FretboardSystem({ fretCount: 12 });
    const scale = system.getScale({ root: 'Cb', type: 'major' });
    scale
        .map(({ note, octave }, index) => note === 'Cb' ? { octave, index } : null)
        .filter(x => !!x)
        .forEach(({ octave, index }) => {
            const { octave: prevOctave, fret } = scale[index - 1];
            if (!prevOctave || fret === 0 || fret === 12) {
                return;
            }
            t.is(octave, (prevOctave as number) + 1);
        })
});

test('FretboardSystem - getTriad()', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad();
    t.deepEqual(triad, [
        { string: 6, fret: 8, note: 'C', octave: 3, degree: 1 },
        { string: 5, fret: 7, note: 'E', octave: 3, degree: 3 },
        { string: 4, fret: 5, note: 'G', octave: 3, degree: 5 },
    ]);
});

test('FretboardSystem - getTriad() - Minor type', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'C',
        string: 6,
        type: TriadTypes.Minor,
        layout: TriadLayouts.One,
        inversion: TriadInversions.Root
    });
    t.deepEqual(triad, [
        { string: 6, fret: 8, note: 'C', octave: 3, degree: 1 },
        { string: 5, fret: 6, note: 'Eb', octave: 3, degree: 3 },
        { string: 4, fret: 5, note: 'G', octave: 3, degree: 5 },
    ]);
});

test('FretboardSystem - getTriad() - Diminished type', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'C',
        string: 6,
        type: TriadTypes.Diminished,
        layout: TriadLayouts.One,
        inversion: TriadInversions.Root
    });
    t.deepEqual(triad, [
        { string: 6, fret: 8, note: 'C', octave: 3, degree: 1 },
        { string: 5, fret: 6, note: 'Eb', octave: 3, degree: 3 },
        { string: 4, fret: 4, note: 'Gb', octave: 3, degree: 5 },
    ]);
});

test('FretboardSystem - getTriad() - Augmented type', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'C',
        string: 6,
        type: TriadTypes.Augmented,
        layout: TriadLayouts.One,
        inversion: TriadInversions.Root
    });
    t.deepEqual(triad, [
        { string: 6, fret: 8, note: 'C', octave: 3, degree: 1 },
        { string: 5, fret: 7, note: 'E', octave: 3, degree: 3 },
        { string: 4, fret: 6, note: 'G#', octave: 3, degree: 5 },
    ]);
});

test('FretboardSystem - getTriad() - OnePlusTwo layout', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'C',
        string: 6,
        type: TriadTypes.Major,
        layout: TriadLayouts.OnePlusTwo,
        inversion: TriadInversions.Root
    });
    t.deepEqual(triad, [
        { string: 6, fret: 8, note: 'C', octave: 3, degree: 1 },
        { string: 5, fret: 7, note: 'E', octave: 3, degree: 3 },
        { string: 5, fret: 10, note: 'G', octave: 3, degree: 5 },
    ]);
});

test('FretboardSystem - getTriad() - TwoPlusOne layout', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'C',
        string: 6,
        type: TriadTypes.Major,
        layout: TriadLayouts.TwoPlusOne
    });
    t.deepEqual(triad, [
        { string: 6, fret: 8, note: 'C', octave: 3, degree: 1 },
        { string: 6, fret: 12, note: 'E', octave: 3, degree: 3 },
        { string: 5, fret: 10, note: 'G', octave: 3, degree: 5 },
    ]);
});

test('FretboardSystem - getTriad() - Three Layout', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'E',
        string: 6,
        type: TriadTypes.Major,
        layout: TriadLayouts.Three
    });
    t.deepEqual(triad, [
        { string: 6, fret: 0, note: 'E', octave: 2, degree: 1 },
        { string: 6, fret: 4, note: 'G#', octave: 2, degree: 3 },
        { string: 6, fret: 7, note: 'B', octave: 2, degree: 5 },
    ]);
});

test('FretboardSystem - getTriad() - fifth string', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'C',
        type: TriadTypes.Major,
        string: 5,
        layout: TriadLayouts.One
    });
    t.deepEqual(triad, [
        { string: 5, fret: 3, note: 'C', octave: 3, degree: 1 },
        { string: 4, fret: 2, note: 'E', octave: 3, degree: 3 },
        { string: 3, fret: 0, note: 'G', octave: 3, degree: 5 },
    ]);
});

test('FretboardSystem - getTriad() - fourth string', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'C',
        type: TriadTypes.Major,
        string: 4,
        layout: TriadLayouts.One
    });
    t.deepEqual(triad, [
        { string: 4, fret: 10, note: 'C', octave: 4, degree: 1 },
        { string: 3, fret: 9, note: 'E', octave: 4, degree: 3 },
        { string: 2, fret: 8, note: 'G', octave: 4, degree: 5 },
    ]);
});

test('FretboardSystem - getTriad() - third string', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'C',
        type: TriadTypes.Major,
        string: 3,
        layout: TriadLayouts.One,
        inversion: TriadInversions.Root
    });
    t.deepEqual(triad, [
        { string: 3, fret: 5, note: 'C', octave: 4, degree: 1 },
        { string: 2, fret: 5, note: 'E', octave: 4, degree: 3 },
        { string: 1, fret: 3, note: 'G', octave: 4, degree: 5 },
    ]);
});

test('FretboardSystem - getTriad() - second string', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'C',
        type: TriadTypes.Major,
        string: 2,
        layout: TriadLayouts.OnePlusTwo
    });
    t.deepEqual(triad, [
        { string: 2, fret: 1, note: 'C', octave: 4, degree: 1 },
        { string: 1, fret: 0, note: 'E', octave: 4, degree: 3 },
        { string: 1, fret: 3, note: 'G', octave: 4, degree: 5 },
    ]);
});

test('FretboardSystem - getTriad() - second string', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'F',
        type: TriadTypes.Major,
        layout: TriadLayouts.One,
        string: 6
    });
    t.deepEqual(triad, [
        { string: 6, fret: 13, note: 'F', octave: 3, degree: 1 },
        { string: 5, fret: 12, note: 'A', octave: 3, degree: 3 },
        { string: 4, fret: 10, note: 'C', octave: 4, degree: 5 },
    ]);
});

test('FretboardSystem - getTriad() - first inversion, sixth string', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'C',
        string: 6,
        type: TriadTypes.Major,
        layout: TriadLayouts.One,
        inversion: TriadInversions.First,
    });
    t.deepEqual(triad, [
        { string: 6, fret: 12, note: 'E', octave: 3, degree: 3 },
        { string: 5, fret: 10, note: 'G', octave: 3, degree: 5 },
        { string: 4, fret: 10, note: 'C', octave: 4, degree: 1 },
    ]);
});

test('FretboardSystem - getTriad() - second inversion, sixth string', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'C',
        string: 6,
        type: TriadTypes.Major,
        layout: TriadLayouts.One,
        inversion: TriadInversions.Second,
    });
    t.deepEqual(triad, [
        { string: 6, fret: 3, note: 'G', octave: 2, degree: 5 },
        { string: 5, fret: 3, note: 'C', octave: 3, degree: 1 },
        { string: 4, fret: 2, note: 'E', octave: 3, degree: 3 },
    ]);
});

test('FretboardSystem - getTriad() - first inversion, fourth string', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'C',
        string: 4,
        type: TriadTypes.Major,
        layout: TriadLayouts.One,
        inversion: TriadInversions.First,
    });
    t.deepEqual(triad, [
        { string: 4, fret: 2, note: 'E', octave: 3, degree: 3 },
        { string: 3, fret: 0, note: 'G', octave: 3, degree: 5 },
        { string: 2, fret: 1, note: 'C', octave: 4, degree: 1 },
    ]);
});

test('FretboardSystem - getTriad() - first inversion, fourth string, up one octave', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'B',
        string: 4,
        type: TriadTypes.Major,
        layout: TriadLayouts.One,
        inversion: TriadInversions.First,
    });
    t.deepEqual(triad, [
        { string: 4, fret: 13, note: 'D#', octave: 4, degree: 3 },
        { string: 3, fret: 11, note: 'F#', octave: 4, degree: 5 },
        { string: 2, fret: 12, note: 'B', octave: 4, degree: 1 },
    ]);
});

test('FretboardSystem - getTriad() - second inversion, fourth string', t => {
    const system = new FretboardSystem();
    const triad = system.getTriad({
        root: 'C',
        string: 4,
        type: TriadTypes.Major,
        layout: TriadLayouts.One,
        inversion: TriadInversions.Second,
    });
    t.deepEqual(triad, [
        { string: 4, fret: 5, note: 'G', octave: 3, degree: 5 },
        { string: 3, fret: 5, note: 'C', octave: 4, degree: 1 },
        { string: 2, fret: 5, note: 'E', octave: 4, degree: 3 },
    ]);
});