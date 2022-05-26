import { get as getNote, chroma as getChroma, transpose } from '@tonaljs/note';
import { distance, semitones } from '@tonaljs/interval';
import { get as getScale } from '@tonaljs/scale';

import {
    Systems,
    getBox,
    getModeFromScaleType
} from './systems/systems';

import { Position, Tuning } from '../fretboard/Fretboard';

import {
    GUITAR_TUNINGS,
    DEFAULT_FRET_COUNT
} from '../constants';

const CHROMATIC_SCALE = getScale('C chromatic').notes;

export type FretboardPosition = {
    string: number;
    fret: number;
    chroma: number;
}

type FretboardSystemParams = {
    tuning?: Tuning;
    fretCount?: number;
}

type ScaleParams = {
    type: string;
    root: string;
    box?: {
        system: Systems;
        box: string | number;
    };
}

export enum TriadTypes {
    Major = '3M-5P',
    Minor = '3m-5P',
    Diminished = '3m-5d',
    Augmented = '3M-5A',
}

export enum TriadLayout {
    Three = 'Three',
    OnePlusTwo = 'OnePlusTwo',
    TwoPlusOne = 'TwoPlusOne',
    One = 'One',
}

const LayoutPositions = {
    [TriadTypes.Major]: {
        [TriadLayout.Three]: [{ fret: 0, string: 0 }, { fret: 4, string: 0 }, { fret: 7, string: 0 }],
        [TriadLayout.OnePlusTwo]: [{ fret: 0, string: 0 }, { fret: -1, string: -1 }, { fret: 2, string: -1 }],
        [TriadLayout.TwoPlusOne]: [{ fret: 0, string: 0 }, { fret: 4, string: 0 }, { fret: 2, string: -1 }],
        [TriadLayout.One]: [{ fret: 0, string: 0 }, { fret: -1, string: -1 }, { fret: -3, string: -2 }],
    },
    [TriadTypes.Minor]: {
        [TriadLayout.Three]: [{ fret: 0, string: 0 }, { fret: 3, string: 0 }, { fret: 7, string: 0 }],
        [TriadLayout.OnePlusTwo]: [{ fret: 0, string: 0 }, { fret: -2, string: -1 }, { fret: 2, string: -1 }],
        [TriadLayout.TwoPlusOne]: [{ fret: 0, string: 0 }, { fret: 3, string: 0 }, { fret: 2, string: -1 }],
        [TriadLayout.One]: [{ fret: 0, string: 0 }, { fret: -2, string: -1 }, { fret: -3, string: -2 }],
    },
    [TriadTypes.Diminished]: {
        [TriadLayout.Three]: [{ fret: 0, string: 1 }, { fret: 4, string: 1 }, { fret: 7, string: 1 }],
        [TriadLayout.OnePlusTwo]: [{ fret: 0, string: 0 }, { fret: -2, string: -1 }, { fret: 1, string: -1 }],
        [TriadLayout.TwoPlusOne]: [{ fret: 0, string: 0 }, { fret: 3, string: 0 }, { fret: 1, string: -1 }],
        [TriadLayout.One]: [{ fret: 0, string: 0 }, { fret: -2, string: -1 }, { fret: -4, string: -2 }],
    },
    [TriadTypes.Augmented]: {
        [TriadLayout.Three]: [{ fret: 0, string: 0 }, { fret: 4, string: 0 }, { fret: 8, string: 0 }],
        [TriadLayout.OnePlusTwo]: [{ fret: 0, string: 0 }, { fret: -1, string: -1 }, { fret: 3, string: -1 }],
        [TriadLayout.TwoPlusOne]: [{ fret: 0, string: 0 }, { fret: 5, string: 0 }, { fret: 3, string: -1 }],
        [TriadLayout.One]: [{ fret: 0, string: 0 }, { fret: -1, string: -1 }, { fret: -2, string: -2 }],
    },
}

type GetTriadArgs = {
    root: string;
    type: TriadTypes;
    string?: number;
    layout?: TriadLayout;
};

function parseNote(note: string): {
    note: string;
    octave: number;
} {
    let octave = +note.slice(-1);
    let parsedNote = note;
    if (isNaN(octave)) {
        octave = 2;
    } else {
        parsedNote = note.slice(0, -1);
    }
    return {
        octave,
        note: parsedNote
    };
}

function getOctaveInScale({
    root,
    note,
    octave,
    baseOctave
}: {
    root: string;
    note: string;
    octave: number;
    baseOctave: number;
}): number {
    const noteChroma = getChroma(note) || 0;
    const rootChroma = getChroma(root) || 0;

    if (rootChroma > noteChroma) {
        return octave - 1 - baseOctave;
    }
    return octave - baseOctave;
}

export function isPositionInBox({ fret, string }: Position, systemPositions: Position[]): boolean {
    return !!systemPositions.find(x => x.fret === fret && x.string === string);
}

export function transposePositionsByOneOctave(positions: Position[]): Position[] {
    return positions.map(x => ({
        ...x,
        fret: x.fret + 12,
        octave: x.octave + 1
    }));
}

export class FretboardSystem {
    private tuning: Tuning = GUITAR_TUNINGS.default;
    private fretCount: number = DEFAULT_FRET_COUNT;
    private positions: FretboardPosition[];
    private baseNote: string;
    private baseOctave: number;
    constructor(params?: FretboardSystemParams) {
        Object.assign(this, params);
        const { note: baseNote, octave: baseOctave } = parseNote(this.tuning[0]);
        this.baseNote = baseNote;
        this.baseOctave = baseOctave;
        this.populate();
    }
    getTuning(): Tuning {
        return this.tuning;
    }
    getFretCount(): number {
        return this.fretCount;
    }
    getNoteAtPosition(position: Position): string {
        const { chroma } = this.positions.find(
            x => x.string === position.string && x.fret === position.fret
        );
        return CHROMATIC_SCALE[chroma];
    }
    getPositionForNote(note: string, string = this.tuning.length): Position {
        const { note: stringRoot } = parseNote(this.tuning[this.tuning.length - string]);

        const fret = semitones(distance(stringRoot, note));
        const chroma = getChroma(note);
        const octave = this.getOctave({
            fret,
            string,
            note,
            chroma
        });

        return { string, fret, note, octave } as Position;
    }
    getTriad({ root, type, string, layout }: GetTriadArgs = {
        root: 'C',
        type: TriadTypes.Major,
        layout: TriadLayout.One
    }): Position[] {
        const rootPosition = { ...this.getPositionForNote(root, string), degree: 1 };

        const [thirdInterval, fifthInterval] = type.split('-');
        const positions = LayoutPositions[type][layout];

        const thirdNote = getNote(transpose(`${rootPosition.note}${rootPosition.octave}`, thirdInterval));
        const fifthNote = getNote(transpose(`${rootPosition.note}${rootPosition.octave}`, fifthInterval));

        const thirdString = rootPosition.string + positions[1].string;
        const fifthString = rootPosition.string + positions[2].string;

        const thirdStringOffset = (thirdString !== rootPosition.string && thirdString === 2 ? 1 : 0);
        const fifthStringOffset = (fifthString !== thirdString && fifthString === 2 ? 1 : 0);

        const thirdPosition = {
            string: thirdString,
            fret: rootPosition.fret + positions[1].fret + thirdStringOffset,
            note: `${thirdNote.letter}${thirdNote.acc}`,
            octave: thirdNote.oct,
            degree: 3
        };

        const fifthPosition = {
            string: fifthString,
            fret: rootPosition.fret + positions[2].fret + thirdStringOffset + fifthStringOffset,
            note: `${fifthNote.letter}${fifthNote.acc}`,
            octave: fifthNote.oct,
            degree: 5
        };

        if (thirdPosition.fret < 0 || fifthPosition.fret < 0) {
            return transposePositionsByOneOctave([
                rootPosition,
                thirdPosition,
                fifthPosition
            ]);
        }

        return [
            rootPosition,
            thirdPosition,
            fifthPosition
        ];
    }
    getScale({
        type = 'major',
        root: paramsRoot = 'C',
        box
    }: ScaleParams): Position[] {
        const { baseOctave } = this;
        const { note: root } = parseNote(paramsRoot);
        const scaleName = `${root} ${type}`;
        const { notes, empty, intervals } = getScale(scaleName);

        if (empty) {
            throw new Error(`Cannot find scale: ${scaleName}`);
        }

        const mode = getModeFromScaleType(type);
        const boxPositions: Position[] = box ? this.adjustOctave(getBox({
            root, mode, ...box
        }), paramsRoot) : [];

        const reverseMap = notes.map((note, index) => ({
            chroma: getChroma(note),
            note,
            interval: intervals[index],
            degree: + intervals[index][0]
        }));
        return this.positions
            .filter(({ chroma }) => reverseMap.find(x => x.chroma === chroma))
            .map(({ chroma, ...rest }) => ({
                ...reverseMap.find(x => x.chroma === chroma),
                ...rest
            }))
            .map(x => {
                const octave = this.getOctave(x);
                const position: Position = {
                    octave,
                    octaveInScale: getOctaveInScale({ root, octave, baseOctave, ...x }),
                    ...x
                };
                if (boxPositions.length && isPositionInBox(x, boxPositions)) {
                    position.inBox = true;
                }
                return position;
            });
    }
    private adjustOctave(positions: Position[], root: string): Position[] {
        const { tuning } = this;
        const rootOffset = semitones(distance(tuning[0], root)) >= 12;
        const negativeFrets = positions.filter(x => x.fret < 0).length > 0;
        return positions.map(({ string, fret }) => ({
            string,
            fret: rootOffset || negativeFrets ? fret + 12 : fret
        }));
    }
    private populate(): void {
        const { tuning, fretCount } = this;
        this.positions = tuning
            .slice().reverse()
            .reduce((memo, note, index) => {
                const string = index + 1;
                const { chroma } = getNote(note);
                const filledString = Array.from(
                    { length: fretCount + 1 },
                    (_, fret) => ({
                        string,
                        fret,
                        chroma: (chroma + fret) % 12
                    })
                );
                return [...memo, ...filledString];
            }, []);
    }
    private getOctave({ fret, string, chroma, note }: {
        fret: number;
        string: number;
        note: string;
        chroma: number;
    }): number {
        const { tuning } = this;
        const baseNoteWithOctave = tuning[tuning.length - string];
        const { note: baseNote, octave: baseOctave } = parseNote(baseNoteWithOctave);
        const baseChroma = getChroma(baseNote);

        let octaveIncrement = chroma < baseChroma ? 1 : 0;

        if (note === 'B#' && octaveIncrement > 0) {
            octaveIncrement--;
        } else if (note === 'Cb' && octaveIncrement === 0) {
            octaveIncrement++;
        }
        octaveIncrement += Math.floor(fret / 12);
        return baseOctave + octaveIncrement;
    }
}