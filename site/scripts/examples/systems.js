import { Fretboard, Systems} from "../../../dist/fretboard.esm.js";
import { fretboardConfiguration, colors } from "../config.js";

function pentatonicSystemExample() {
  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    el: "#fretboard-systems-pentatonic-minor",
    dotText: ({ note, octave, interval }) => note,
    dotFill: ({ interval, disabled }) =>
      disabled
        ? colors.disabled
        : interval === '1P'
        ? colors.defaultActiveFill : colors.defaultFill,
  });

  const root = "E";
  const mode = "minor";
  const box = 1;

  fretboard.renderScale({
    scale: `${mode} pentatonic`,
    root,
    box,
    system: Systems.pentatonicMinor,
  });

  document.querySelectorAll("[data-pentatonic-box").forEach((el) => {
    el.addEventListener("click", () => {
      const { pentatonicBox } = el.dataset;
      fretboard.renderScale({
        scale: `${mode} pentatonic`,
        root,
        box: pentatonicBox,
        system: Systems.pentatonicMinor,
      });
    });
  });
}

function CAGEDSystemExample() {
  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    el: "#fretboard-systems-caged",
    dotText: ({ note, octave, interval }) => note,
    dotFill: ({ interval, disabled }) =>
      disabled
        ? colors.disabled
        : interval === "1P"
        ? colors.defaultActiveFill
        : colors.defaultFill,
  });

  const root = "C";
  const mode = "major";
  const box = 'C';

  fretboard.renderScale({
    scale: `${mode}`,
    root,
    box,
    system: Systems.CAGED,
  });

  document.querySelectorAll("[data-caged-box").forEach((el) => {
    el.addEventListener("click", () => {
      const { cagedBox } = el.dataset;
      fretboard.renderScale({
        scale: `${mode}`,
        root,
        box: cagedBox,
        system: Systems.CAGED,
      });
    });
  });
}

export default function systems() {
    pentatonicSystemExample();
    CAGEDSystemExample();
}
