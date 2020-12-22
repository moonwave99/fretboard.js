import test from 'ava';

import { getBox, Systems } from './systems';
import { isPositionInBox } from '../FretboardSystem';

test('pentatonic system', t => {
    const positions = getBox({
        system: Systems.pentatonic,
        root: 'E',
        box: 1
    });
    t.is(isPositionInBox({ string: 6, fret: 3 }, positions), true);
    t.is(isPositionInBox({ string: 6, fret: 4 }, positions), false);
});

test('pentatonic system - major pentatonic', t => {
    const positions = getBox({
        system: Systems.pentatonic,
        root: 'G',
        box: 1,
        mode: 'major'
    });
    t.is(isPositionInBox({ string: 6, fret: 3 }, positions), true);
    t.is(isPositionInBox({ string: 6, fret: 5 }, positions), true);
});

test('CAGED system', t => {
    const positions = getBox({
        system: Systems.CAGED,
        root: 'C',
        box: 'A'
    });
    t.is(isPositionInBox({ string: 6, fret: 3 }, positions), true);
    t.is(isPositionInBox({ string: 2, fret: 1 }, positions), false);
});

test('CAGED system - box not found', t => {
    const error = t.throws(() => getBox({
        system: Systems.CAGED,
        root: 'E',
        box: 'H'
    }));

    t.is(error.message, 'Cannot find box H in the CAGED scale system');
});

test('pentatonic system - box not found', t => {
    const error = t.throws(() => getBox({
        system: Systems.pentatonic,
        root: 'E',
        box: 6
    }));

    t.is(error.message, 'Cannot find box 6 in the pentatonic scale system');
});

test('three notes per string system - box not found', t => {
    const error = t.throws(() => getBox({
        system: Systems.TNPS,
        root: 'E',
        box: 8
    }));

    t.is(error.message, 'Cannot find box 8 in the TNPS scale system');
});