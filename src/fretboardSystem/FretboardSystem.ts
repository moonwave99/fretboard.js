import { get as getNote, chroma as getChroma, transpose } from '@tonaljs/note';
import {
    distance, semitones, add as addInterval,
    substract as substractInterval
} from '@tonaljs/interval';
import { get as getScale } from '@tonaljs/scale';
import { getChord } from '@tonaljs/chord';

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
    Major = 'M',
    Minor = 'm',
    Diminished = 'dim',
    Augmented = 'aug',
}

export enum TriadLayouts {
    Three = 'Three',
    OnePlusTwo = 'OnePlusTwo',
    TwoPlusOne = 'TwoPlusOne',
    One = 'One',
}

export enum TriadInversions {
    Root = 'Root',
    First = 'First',
    Second = 'Second'
}

const TriadIntervals = {
    [TriadTypes.Major]: {
        [TriadInversions.Root]: ['3M', '3m'],
        [TriadInversions.First]: ['3m', '4P'],
        [TriadInversions.Second]: ['4P', '3M'],
    },
    [TriadTypes.Minor]: {
        [TriadInversions.Root]: ['3m', '3M'],
        [TriadInversions.First]: ['3M', '4P'],
        [TriadInversions.Second]: ['4P', '3m'],
    },
    [TriadTypes.Diminished]: {
        [TriadInversions.Root]: ['3m', '3m'],
        [TriadInversions.First]: ['3m', '4A'],
        [TriadInversions.Second]: ['4A', '3m'],
    },
    [TriadTypes.Augmented]: {
        [TriadInversions.Root]: ['3M', '3M'],
        [TriadInversions.First]: ['3M', '3M'],
        [TriadInversions.Second]: ['3M', '3M'],
    },
}

export function transposeByOneOctave(position: Position): Position {
    return {
        ...position,
        fret: position.fret + 12,
        octave: position.octave + 1
    }
}

type ChordNote = {
    note: string;
    degree: number;
}

function getChordStructure(root: string, type: TriadTypes, inversion: TriadInversions): ChordNote[] {
    const { notes } = getChord(type, root);
    const chord = [1, 3, 5].map((degree, index) => ({ note: notes[index], degree }));

    switch (inversion) {
        case TriadInversions.Root:
        default:
            return chord;
        case TriadInversions.First:
            return [chord[1], chord[2], chord[0]];
        case TriadInversions.Second:
            return [chord[2], chord[0], chord[1]];
    }
}

function getStringInterval(first: number, second: number): string {
    return (first === 3 && second === 2) ? '3M' : '4P';
}

export type TriadNote = Position & {
    note: string;
    octave: number;
    degree: number;
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

type GetTriadOptions = {
    root: string;
    string: number;
    type?: TriadTypes;
    layout?: TriadLayouts;
    inversion?: TriadInversions;
}

const DEFAULT_GET_TRIAD_OPTIONS = {
    root: 'C',
    string: 6,
    type: TriadTypes.Major,
    layout: TriadLayouts.One,
    inversion: TriadInversions.Root
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
    getPositionForNote(note: string, string: number): Position {
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
    getTriad(options: GetTriadOptions = DEFAULT_GET_TRIAD_OPTIONS): Position[] {
        options = Object.assign({}, DEFAULT_GET_TRIAD_OPTIONS, options);
        const { root, string, type, layout, inversion } = options;

        const chord = getChordStructure(root, type, inversion);

        const [firstInterval, secondInterval] = TriadIntervals[type][inversion];

        const firstNotePosition = { degree: chord[0].degree, ...this.getPositionForNote(chord[0].note, string) };
        const secondNoteInfo = getNote(
            transpose(`${firstNotePosition.note}${firstNotePosition.octave}`, firstInterval)
        );
        const thirdNoteInfo = getNote(
            transpose(`${firstNotePosition.note}${firstNotePosition.octave}`, addInterval(firstInterval, secondInterval))
        );

        const secondNote = {
            note: `${secondNoteInfo.letter}${secondNoteInfo.acc}`,
            octave: secondNoteInfo.oct,
            degree: chord[1].degree
        } as Position;
        const thirdNote = {
            note: `${thirdNoteInfo.letter}${thirdNoteInfo.acc}`,
            octave: thirdNoteInfo.oct,
            degree: chord[2].degree
        } as Position;

        const secondNotePosition = {} as Position;
        const thirdNotePosition = {} as Position;

        switch (layout) {
            case TriadLayouts.One: {
                secondNotePosition.string = firstNotePosition.string - 1;
                const firstOffset = getStringInterval(firstNotePosition.string, secondNotePosition.string);
                secondNotePosition.fret = firstNotePosition.fret + semitones(substractInterval(firstInterval, firstOffset));
                thirdNotePosition.string = secondNotePosition.string - 1;
                const secondOffset = getStringInterval(secondNotePosition.string, thirdNotePosition.string);
                thirdNotePosition.fret = secondNotePosition.fret + semitones(substractInterval(secondInterval, secondOffset));
                break;
            }
            case TriadLayouts.Three: {
                secondNotePosition.string = firstNotePosition.string;
                secondNotePosition.fret = firstNotePosition.fret + semitones(firstInterval);
                thirdNotePosition.string = firstNotePosition.string;
                thirdNotePosition.fret = secondNotePosition.fret + semitones(secondInterval);
                break;
            }
            case TriadLayouts.OnePlusTwo: {
                secondNotePosition.string = firstNotePosition.string - 1;
                const firstOffset = getStringInterval(firstNotePosition.string, secondNotePosition.string);
                secondNotePosition.fret = firstNotePosition.fret + semitones(substractInterval(firstInterval, firstOffset));
                thirdNotePosition.string = secondNotePosition.string;
                thirdNotePosition.fret = secondNotePosition.fret + semitones(secondInterval);
                break;
            }
            case TriadLayouts.TwoPlusOne: {
                secondNotePosition.string = firstNotePosition.string;
                secondNotePosition.fret = firstNotePosition.fret + semitones(firstInterval);
                thirdNotePosition.string = secondNotePosition.string - 1;
                const secondOffset = getStringInterval(secondNotePosition.string, thirdNotePosition.string);
                thirdNotePosition.fret = secondNotePosition.fret + semitones(substractInterval(secondInterval, secondOffset));
                break;
            }
        }

        const triad = [
            firstNotePosition,
            { ...secondNotePosition, ...secondNote },
            { ...thirdNotePosition, ...thirdNote }
        ];

        if (triad.some(x => x.fret < 0)) {
            return triad.map(transposeByOneOctave);
        }

        return triad;
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