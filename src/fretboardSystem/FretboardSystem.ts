import { get as getNote, chroma as getChroma } from '@tonaljs/note';
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
    box?: string | number;
    system?: Systems;
}

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

export function isPositionInBox({ fret, string }: Position, systemPositions: Position[]): boolean {
    return !!systemPositions.find(x => x.fret === fret && x.string === string);
}

export class FretboardSystem {
    private tuning: Tuning = GUITAR_TUNINGS.default;
    private fretCount: number = DEFAULT_FRET_COUNT;
    private positions: FretboardPosition[];
    constructor(params?: FretboardSystemParams) {
        Object.assign(this, params);
        this.populate();
    }
    getTuning(): Tuning {
        return this.tuning;
    }
    getFretCount(): number {
        return this.fretCount;
    }
    getScale({
        type = 'major',
        root: paramsRoot = 'C',
        box,
        system
    }: ScaleParams): Position[] {
        const { note: root, octave } = parseNote(paramsRoot);
        const scaleName = `${root} ${type}`;
        const { notes, empty, intervals } = getScale(scaleName);

        if (empty) {
            throw new Error(`Cannot find scale: ${scaleName}`);
        }

        const mode = getModeFromScaleType(type);

        const boxPositions: Position[] = system ? getBox({
            root, box, mode, octave, system
        }) : [];

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
                const position: Position = {
                    octave: this.getOctave(x),
                    ...x
                };
                if (boxPositions.length && isPositionInBox(x, boxPositions)) {
                    position.inSystem = true;
                }
                return position;
            });
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