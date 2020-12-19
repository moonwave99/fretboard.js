import test from 'ava';

import { FretboardSystem } from './FretboardSystem';
import {
    GUITAR_TUNINGS,
    DEFAULT_FRET_COUNT
} from '../constants';

import { pentatonicSystem } from './systems/systems';

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
        name: 'E minor pentatonic',
    });
    t.deepEqual(scale[0], {
        octave: 4,
        chroma: 4,
        note: 'E',
        interval: '1P',
        degree: 1,
        string: 1,
        fret: 0,
        inSystem: false
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
        system: pentatonicSystem({
            root: 'E',
            box: 1
        })
    });
    t.is(
        scale.filter(({ inSystem }) => inSystem).length,
        12
    );
});

test('FretboardSystem - getScale() - B#', t => {
    const system = new FretboardSystem({ fretCount: 12 });
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
    const system = new FretboardSystem({ fretCount: 12 });
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