import { chroma as getChroma } from '@tonaljs/note';
import { get as getMode } from '@tonaljs/mode';
import { Position } from '../../fretboard/Fretboard';

export enum Systems {
    pentatonic = 'pentatonic',
    CAGED = 'CAGED',
    TNPS = 'TNPS'
}

export type IncludeFunction = (p: Position) => boolean;

type ScaleDefinition = {
    box: string[];
    baseChroma: number;
}

type SystemParams = {
    root: string;
    box: number|string;
    mode?: number;
}

const DEFAULT_MODE = 0;
const DEFAULT_PENTATONIC_MODE = 5;
const CAGED_ORDER = 'GEDCA';

const CAGEDDefinition: ScaleDefinition[] = [
    {
        box: [
            '-6-71',
            '-34-5',
            '71-2-',
            '-5-6-',
            '-2-34',
            '-6-71'
        ],
        baseChroma: getChroma('G#')
    },        
    {
        box: [
            '71-2',
            '-5-6',
            '2-34',
            '6-71',
            '34-5',
            '71-2'
        ],
        baseChroma: getChroma('E#')
    },    
    {
        box: [
            '-2-34',
            '-6-71',
            '34-5',
            '71-2-',
            '-5-6-',
            '-2-34'
        ],
        baseChroma: getChroma('D#')
    },    
    {
        box: [
            '34-5',
            '71-2',
            '5-6-',
            '2-34',
            '6-71',
            '34-5'
        ],
        baseChroma: getChroma('C')
    },    
    {
        box: [
            '-5-6-',
            '-2-34',
            '6-71-',
            '34-5-',
            '71-2-',
            '-5-6-'
        ],
        baseChroma: getChroma('A#')
    }
]

const TNPSDefinition: ScaleDefinition[] = [
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

function getBoxPositions({
    root,
    box,
    modeOffset = 0,
    baseChroma
}: {
    root: string;
    box: string[];
    modeOffset: number;
    baseChroma: number;
}): Position[] {
    let delta = getChroma(root) - baseChroma - modeOffset;
    while (delta < -1) {
        delta += 12;
    }
    return box.reduce((memo, item, string) => ([
        ...memo,
        ...item.split('').map(
            (x, i) => x !== '-'
                ? { string: string + 1, fret: i + delta }
                : null
            ).filter(x => !!x)
    ]), []);
}

function getModeOffset(mode: number): number {
    return getChroma('CDEFGAB'.split('')[mode]);
}

function isPositionInSystem({ fret, string }: Position, systemPositions: Position[]): boolean {
    return !!systemPositions.find(x => x.fret === fret && x.string === string);
}

function getPentatonicBoxIndex(box: number, mode: number): number {
    if (mode === DEFAULT_PENTATONIC_MODE) {
        return box - 1;
    }
    return box % 5;
}

export function getModeFromScaleType(type: string): number {
    const { modeNum } = getMode(type.replace('pentatonic', '').trim());
    return modeNum;
}

export function getBox({
    root,
    mode,
    system,
    box
}: {
    root: string;
    mode: number|string;
    system: Systems;
    box: string|number;
}): Position[] {
    let foundBox;
    let modeNumber;

    if (typeof mode === 'string') {
        modeNumber = getModeFromScaleType(mode);
    } else {
        modeNumber = mode;
    }

    switch (system) {
        case Systems.pentatonic:
            foundBox = CAGEDDefinition[getPentatonicBoxIndex(+box, modeNumber)];
            break;
        case Systems.CAGED:
            foundBox = CAGEDDefinition[CAGED_ORDER.indexOf(`${box}`)];
            break;
        case Systems.TNPS:
            foundBox = TNPSDefinition[+box - 1];
            break;
    }
    
    if (!foundBox) {
        throw new Error(`Cannot find box ${box} in the ${Systems[system]} scale system`);
    }
    
    return getBoxPositions({
        root,
        modeOffset: getModeOffset(modeNumber),
        baseChroma: foundBox.baseChroma,
        box: system === Systems.pentatonic
            ? foundBox.box.slice().map(x => x.replace('4', '-').replace('7', '-'))
            : foundBox.box
    });    
}

export function pentatonicSystem({ root, box, mode = DEFAULT_PENTATONIC_MODE }: SystemParams): IncludeFunction {
    const positions = getBox({
        root,
        box,
        mode,
        system: Systems.pentatonic
    });
    return (position: Position): boolean => isPositionInSystem(position, positions);
}

export function CAGEDSystem({ root, box, mode = DEFAULT_MODE }: SystemParams): IncludeFunction {
    const positions = getBox({
        root,
        box,
        mode,
        system: Systems.CAGED
    });
    return (position: Position): boolean => isPositionInSystem(position, positions);
}

export function ThreeNotesPerStringSystem({ root, box, mode = DEFAULT_MODE}: SystemParams): IncludeFunction {
    const positions = getBox({
        root,
        box,
        mode,
        system: Systems.TNPS
    });
    return (position: Position): boolean => isPositionInSystem(position, positions);
}