import { chroma as getChroma } from '@tonaljs/note';
export type BoxBounds = [number, number];

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
    box: number;
}

const CAGEDDefinition: { [key: string]: CAGEDScaleDefinition } = {
    E: {
        box: [7, 10],
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

export function pentatonicMinor(params: SystemParams): BoxBounds {
    return pentatonic({
        ...params,
        ...pentatonicMinorDefinition
    });
}

export function pentatonicMajor(params: SystemParams): BoxBounds {
    return pentatonic({
        ...params,
        ...pentatonicMajorDefinition
    });
}

export function CAGEDSystem({ root, box }: SystemParams): BoxBounds {
    const foundBox = CAGEDDefinition[box];
    if (!foundBox) {
        throw new Error(`Cannot find box ${box} in the ${root} CAGED system`);
    }
    return getBoxBounds({
        root,
        ...foundBox
    });
}