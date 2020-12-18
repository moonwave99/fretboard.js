import test from 'ava';

import {
    pentatonicSystem,
    CAGEDSystem,
    ThreeNotesPerStringSystem
} from './systems';

test('pentatonic system', t => {
    const system = pentatonicSystem({
        root: 'E',
        box: 1,
        mode: 5
    });
    t.is(system({ string: 6, fret: 3 }), true);
    t.is(system({ string: 6, fret: 4 }), false);
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
    const error = t.throws(() => pentatonicSystem({
        root: 'E',
        box: 6
    }));

    t.is(error.message, 'Cannot find box 6 in the E pentatonic scale system');
});

test('three notes per string system - box not found', t => {
    const error = t.throws(() => ThreeNotesPerStringSystem({
        root: 'E',
        box: 8
    }));

    t.is(error.message, 'Cannot find box 8 in the TPNS system');
});