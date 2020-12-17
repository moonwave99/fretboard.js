import { chroma as getChroma } from '@tonaljs/note';
import { Position } from '../../fretboard/Fretboard';

export enum Systems {
    pentatonicMinor = 'pentatonicMinor',
    pentatonicMajor = 'pentatonicMajor',
    CAGED = 'CAGED'
}

type BoxBounds = [number, number];

type PentatonicScaleDefinition = {
    boxes: BoxBounds[];
    mode: 'minor'|'major';
    baseChroma: number;
}

type CAGEDScaleDefinition = {
    box: BoxBounds;
    baseChroma: number;
}

type SystemParams = {
    root: string;
    box: number|string;
}

const CAGEDDefinition: { [key: string]: CAGEDScaleDefinition } = {
    E: {
        box: [7, 11],
        baseChroma: 0
    },
    A: {
        box: [2, 6],
        baseChroma: 0
    },
    G: {
        box: [4, 8],
        baseChroma: 0
    },
    C: {
        box: [0, 3],
        baseChroma: 0
    },
    D: {
        box: [9, 13],
        baseChroma: 0
    }
}

const pentatonicMinorDefinition: PentatonicScaleDefinition = {
    boxes: [
        [0, 3],
        [2, 5],
        [4, 8],
        [7, 10],
        [9, 12]        
    ],
    mode: 'minor',
    baseChroma: 4
}

const pentatonicMajorDefinition: PentatonicScaleDefinition = {
    boxes: [
        [2, 5],
        [4, 8],
        [7, 10],
        [9, 12],
        [0, 3],        
    ],
    mode: 'major',
    baseChroma: 7
}

function isPositionInSystem({ fret }: Position, bounds: BoxBounds): boolean {
    return fret >= bounds[0] && fret <= bounds[1];
}

function getBoxBounds({
    root,
    box,
    baseChroma
}: {
    root: string;
    box: BoxBounds;
    baseChroma: number;
}): BoxBounds {
    const delta = (getChroma(root) - baseChroma + 12) % 12;
    const [lowerBound, upperBound] = box;
    const increment = lowerBound + delta >= 12 ? delta - 12 : delta;
    return [
        lowerBound + increment,
        upperBound + increment
    ];
}

function pentatonic({
    root,
    box,
    mode,
    boxes,
    baseChroma
}: {
    root: string;
    box: number;
    mode: string;
    boxes: BoxBounds[];
    baseChroma: number;
}): BoxBounds {
    const foundBox = boxes[box - 1];
    if (!foundBox) {
        throw new Error(`Cannot find box ${box} in the ${root} ${mode} pentatonic scale system`);
    }
    return getBoxBounds({
        root,
        box: foundBox,
        baseChroma
    });
}

export function pentatonicMinorSystem({ box, ...params }: SystemParams): (p: Position) => boolean {
    const bounds = pentatonic({
        box: +box,
        ...params,
        ...pentatonicMinorDefinition
    });
    return (position: Position): boolean => isPositionInSystem(position, bounds);
}

export function pentatonicMajorSystem({ box, ...params }: SystemParams): (p: Position) => boolean {
    const bounds = pentatonic({
        box: +box,
        ...params,
        ...pentatonicMajorDefinition
    });
    return (position: Position): boolean => isPositionInSystem(position, bounds);
}

export function CAGEDSystem({ root, box }: SystemParams): (p: Position) => boolean {
    const foundBox = CAGEDDefinition[box];
    if (!foundBox) {
        throw new Error(`Cannot find box ${box} in the CAGED system`);
    }
    const bounds = getBoxBounds({
        root,
        ...foundBox
    });
    return (position: Position): boolean => isPositionInSystem(position, bounds);
}