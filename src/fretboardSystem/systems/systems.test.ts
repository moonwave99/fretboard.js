import test from 'ava';

import {
    pentatonicMinor,
    pentatonicMajor,
    CAGEDSystem
} from './systems';

test('pentatonic minor system', t => {
    const system = pentatonicMinor({
        root: 'E',
        box: 1
    });
    t.is(system({ string: 6, fret: 3 }), true);
    t.is(system({ string: 6, fret: 4 }), false);
});

test('pentatonic major system', t => {
    const system = pentatonicMajor({
        root: 'G',
        box: 1
    });
    t.is(system({ string: 6, fret: 3 }), true);
    t.is(system({ string: 3, fret: 0 }), false);
});

test('CAGED system', t => {
    const system = CAGEDSystem({
        root: 'C',
        box: 'A'
    });
    t.is(system({ string: 6, fret: 3 }), true);
    t.is(system({ string: 2, fret: 1 }), false);
});

test('CAGED system - box not found', t => {
    const error = t.throws(() => CAGEDSystem({
        root: 'E',
        box: 'H'
    }));

    t.is(error.message, 'Cannot find box H in the CAGED system');
});

test('pentatonic system - box not found', t => {
    const error = t.throws(() => pentatonicMinor({
        root: 'E',
        box: 6
    }));

    t.is(error.message, 'Cannot find box 6 in the E minor pentatonic scale system');
});