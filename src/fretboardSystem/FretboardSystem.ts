import { get as getNote, chroma as getChroma } from '@tonaljs/note';
import { get as getScale } from '@tonaljs/scale';

import {
    IncludeFunction,
    Systems,
    pentatonicSystem,
    CAGEDSystem,
    ThreeNotesPerStringSystem,
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
        type,
        root,
        box,
        system
    }: {
        type: string;
        root: string;
        box?: string | number;
        system?: Systems;
    }): Position[] {
        const scaleName = `${root} ${type}`;
        const { notes, empty, intervals } = getScale(scaleName);

        if (empty) {
            throw new Error(`Cannot find scale: ${scaleName}`);
        }

        const mode = getModeFromScaleType(type);

        let systemGenerator: IncludeFunction;
        switch(system) {
            case Systems.pentatonic:
                systemGenerator = pentatonicSystem({ root, box, mode });
                break;
            case Systems.CAGED:
                systemGenerator = CAGEDSystem({ root, box, mode });
                break;
            case Systems.TNPS:
                systemGenerator = ThreeNotesPerStringSystem({ root, box, mode });
                break;
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
            .map(x => {
                const position: Position = {
                    octave: this.getOctave(x),
                    ...x
                };
                if (systemGenerator && systemGenerator(x)) {
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