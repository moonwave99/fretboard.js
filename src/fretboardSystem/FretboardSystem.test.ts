import test from 'ava';

import {
    FretboardSystem,
    DEFAULT_GUITAR_TUNING,
    DEFAULT_FRET_COUNT,
} from './FretboardSystem';

test('FretboardSystem - constructor with default options', t => {
    const system = new FretboardSystem();
    t.is(system instanceof FretboardSystem, true);
    t.is(system.getTuning(), DEFAULT_GUITAR_TUNING);
    t.is(system.getFrets(), DEFAULT_FRET_COUNT);
});

test('FretboardSystem - constructor with custom options', t => {
    const customParams = {
        tuning: ['G2', 'B2', 'D3', 'G3', 'B3', 'D4'],
        frets: 12
    };
    const system = new FretboardSystem(customParams);
    t.is(system instanceof FretboardSystem, true);
    t.is(system.getTuning(), customParams.tuning);
    t.is(system.getFrets(), customParams.frets);
});

test('FretboardSystem - getScale()', t => {
    const system = new FretboardSystem();
    const scale = system.getScale({
        name: 'E minor pentatonic',
    });
    t.deepEqual(scale[0], {
        octave: 4,
        disabled: false,
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
            name: 'H augmented pentatronic',
        });
    });
    t.is(error.message, 'Cannot find scale: H augmented pentatronic');
});

test('FretboardSystem - getScale() with system', t => {
    const system = new FretboardSystem();
    const scale = system.getScale({
        name: 'E minor pentatonic',
        system: [0, 3]
    });
    t.is(
        scale.filter(({ disabled }) => !disabled).length,
        12
    );
});

test('FretboardSystem - getScale() - B#', t => {
    const system = new FretboardSystem({ frets: 12 });
    const scale = system.getScale({ name: 'B# major' });
    scale
        .map(({ note, octave }, index) => note === 'B#' ?  { octave, index }: null)
        .filter(x => !!x)
        .forEach(({ octave, index }) => {
            const { octave: nextOctave, fret} = scale[index + 1];
            if (!nextOctave || fret === 0 || fret === 12) {
                return;
            }
            t.is(octave, (nextOctave as number) - 1);
        })
});

test('FretboardSystem - getScale() - Cb', t => {
    const system = new FretboardSystem({ frets: 12 });
    const scale = system.getScale({ name: 'Cb major' });
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