import { chroma as getChroma } from '@tonaljs/note';
import { Position } from '../../fretboard/Fretboard';

export enum Systems {
    pentatonicMinor = 'pentatonicMinor',
    pentatonicMajor = 'pentatonicMajor',
    CAGED = 'CAGED',
    TNPS = 'TNPS'
}

export type IncludeFunction = (p: Position) => boolean;

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
        baseChroma: getChroma('C')
    },
    A: {
        box: [2, 6],
        baseChroma: getChroma('C')
    },
    G: {
        box: [4, 8],
        baseChroma: getChroma('C')
    },
    C: {
        box: [0, 3],
        baseChroma: getChroma('C')
    },
    D: {
        box: [9, 13],
        baseChroma: getChroma('C')
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
    baseChroma: getChroma('E')
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
    baseChroma: getChroma('G')
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

export function pentatonicMinorSystem({ box, ...params }: SystemParams): IncludeFunction {
    const bounds = pentatonic({
        box: +box,
        ...params,
        ...pentatonicMinorDefinition
    });
    return (position: Position): boolean => isPositionInSystem(position, bounds);
}

export function pentatonicMajorSystem({ box, ...params }: SystemParams): IncludeFunction {
    const bounds = pentatonic({
        box: +box,
        ...params,
        ...pentatonicMajorDefinition
    });
    return (position: Position): boolean => isPositionInSystem(position, bounds);
}

export function CAGEDSystem({ root, box }: SystemParams): IncludeFunction {
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

type TNPSScaleDefinition = {
    box: string[];
    baseChroma: number;
};

const TNPSDefinition: TNPSScaleDefinition[] = [
    {
        box: [
            '--2-34',
            '--6-71',
            '-34-5-',
            '-71-2-',
            '4-5-6-',
            '1-2-3-'
        ],
        baseChroma: getChroma('E')
    },
    {
        box: [
            '--34-5',
            '--71-2',
            '4-5-6-',
            '1-2-3-',
            '5-6-7-',
            '2-34--'
        ],
        baseChroma: getChroma('D')
    },
    {
        box: [
            '-4-5-6',
            '-1-2-3',
            '5-6-7-',
            '2-34--',
            '6-71--',
            '34-5--'
        ],
        baseChroma: getChroma('C')
    },
    {
        box: [
            '--5-6-7',
            '--2-34-',
            '-6-71--',
            '-34-5--',
            '-71-2--',
            '4-5-6--'
        ],
        baseChroma: getChroma('B')
    },
    {
        box: [
            '--6-71',
            '--34-5',
            '-71-2-',
            '4-5-6-',
            '1-2-3-',
            '5-6-7-'
        ],
        baseChroma: getChroma('A')
    },
    {
        box: [
            '--71-2',
            '-4-5-6',
            '1-2-3-',
            '5-6-7-',
            '2-34--',
            '6-71--'
        ],
        baseChroma: getChroma('G')
    },
    {
        box: [
            '-1-2-3',
            '-5-6-7',
            '2-34--',
            '6-71--',
            '34-5--',
            '71-2--'
        ],
        baseChroma: getChroma('F')
    }                      
];

function getTNPSPositions({
    root,
    box,
    baseChroma
}: {
    root: string;
    box: string[];
    baseChroma: number;
}): Position[] {
    const delta = (getChroma(root) - baseChroma + 12) % 12;

    return box.reduce((memo, item, string) => {
        return [
            ...memo,
            ...item.split('').map((x, i) => {
                if (x === '-') {
                    return;
                }
                return {
                    string: string + 1,
                    fret: i + delta
                };
            }).filter(x => !!x)
        ];
    }, []);
}

export function ThreeNotesPerStringSystem({ root, box }: SystemParams): IncludeFunction {
    const foundBox = TNPSDefinition[+box - 1];
    if (!foundBox) {
        throw new Error(`Cannot find box ${box} in the TPNS system`);
    }
    const positions = getTNPSPositions({ root, ...foundBox });
    return ({ fret, string }: Position): boolean => !!positions.find(x => x.fret === fret && x.string === string);
}