import { colors } from "../config.json";
export { colors } from "../config.json";

export const fretboardConfiguration = {
    height: 200,
    stringsWidth: 1.5,
    dotSize: 25,
    fretCount: 16,
    fretsWidth: 1.2,
    font: "Futura",
};

export const abcjsConfig = {
    program: 25,
    responsive: "resize",
    add_classes: true,
    soundFontUrl: "https://paulrosen.github.io/midi-js-soundfonts/MusyngKite/",
};

export const notesWithAccidentals = "CDEFGAB"
    .split("")
    .map((x) => ("EB".indexOf(x) > -1 ? x : [x, `${x}#`]))
    .flat();

export const modes = [
    "ionian",
    "dorian",
    "phrygian",
    "lydian",
    "mixolydian",
    "aeolian",
    "locrian",
];

const notes = "CDEFGAB".split("");

export const modeMap = modes.map((mode, index) => ({
    mode,
    root: notes[index],
    color: colors.modes[mode],
}));
