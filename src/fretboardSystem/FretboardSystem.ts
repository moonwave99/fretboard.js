import { get as getNote, chroma as getChroma } from '@tonaljs/note';
import { get as getScale } from '@tonaljs/scale';

import { Position } from '../fretboard/Fretboard';

export type FretboardPosition = {
    string: number;
    fret: number;
    chroma: number;
}

export type Tuning = string[];
export const DEFAULT_GUITAR_TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
export const DEFAULT_FRET_COUNT = 15;

type FretboardSystemParams = {
    tuning?: Tuning;
    frets?: number;
}

export class FretboardSystem {
    private tuning: Tuning = DEFAULT_GUITAR_TUNING;
    private frets: number = DEFAULT_FRET_COUNT;
    private positions: FretboardPosition[];
    constructor(params?: FretboardSystemParams) {
        Object.assign(this, params);
        this.populate();
    }
    getTuning(): Tuning {
        return this.tuning;
    }
    getFrets(): number {
        return this.frets;
    }
    getScale({
        name,
        system
    }: {
        name: string;
        system?: (p: Position) => boolean;
    }): Position[] {
        const { notes, empty, intervals } = getScale(name);
        if (empty) {
            throw new Error(`Cannot find scale: ${name}`);
        }
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
            .map(x => ({
                octave: this.getOctave(x),
                disabled: system ? !system(x) : false,
                ...x
            }));
    }    
    private populate(): void {
        const { tuning, frets } = this;
        this.positions = tuning
            .slice().reverse()
            .reduce((memo, note, index) => {
                const string = index + 1;
                const { chroma } = getNote(note);
                const filledString = Array.from(
                    { length: frets + 1 },
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
        const baseChroma = getChroma(baseNoteWithOctave.slice(0, -1));
        const baseOctave = +baseNoteWithOctave.slice(-1);
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