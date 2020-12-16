import {
  Fretboard,
  FretboardSystem,
  pentatonicMinor,
  CAGEDSystem,
} from "../../../dist/fretboard.esm.js";
import { fretboardConfiguration, colors } from "../config.js";

function pentatonicSystemExample() {
  const system = new FretboardSystem();
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

  fretboard.render(
    system.getScale({
      name: `${root} ${mode} pentatonic`,
      system: pentatonicMinor({
        root,
        box,
      }),
    })
  );

  document.querySelectorAll("[data-pentatonic-box").forEach((el) => {
    el.addEventListener("click", () => {
      const { pentatonicBox } = el.dataset;
      fretboard.render(
        system.getScale({
          name: `${root} ${mode} pentatonic`,
          system: pentatonicMinor({
            root,
            box: pentatonicBox,
          }),
        })
      );
    });
  });
}

function CAGEDSystemExample() {
  const system = new FretboardSystem();
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

  fretboard.render(
    system.getScale({
      name: `${root} ${mode}`,
      system: CAGEDSystem({
        root,
        box,
      }),
    })
  );

  document.querySelectorAll("[data-caged-box").forEach((el) => {
    el.addEventListener("click", () => {
      const { cagedBox } = el.dataset;
      fretboard.render(
        system.getScale({
          name: `${root} ${mode}`,
          system: CAGEDSystem({
            root,
            box: cagedBox,
          }),
        })
      );
    });
  });
}

export default function systems() {
    pentatonicSystemExample();
    CAGEDSystemExample();
}
