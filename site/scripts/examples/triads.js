import { get as getScale } from "@tonaljs/scale";
import { Fretboard, TriadLayout } from "../../../dist/fretboard.esm.js";
import { fretboardConfiguration, colors } from "../config.js";

const fills = {
    1: "#9b5de5",
    2: "#f15bb5",
    3: "#F8A07B",
    4: "#FEE440",
    5: "#00BBF9",
    6: "#47F3FF",
    7: "#00CCB1",
};

export default function triads() {
    const fretboard = new Fretboard({
        ...fretboardConfiguration,
        dotText: ({ note }) => note,
    });

    const $form = document.querySelector(".api-actions");

    $form.triadsStrings.addEventListener("change", (event) =>
        renderTriadOverStrings(event.target.value)
    );
    $form.harmonised.addEventListener("change", (event) =>
        renderHarmonised(event.target.value, 6, true)
    );

    renderTriadOverStrings("C");

    function renderTriadOverStrings(root) {
        fretboard
            .clear()
            .setDots(
                [6, 5, 4, 3, 2].reduce(
                    (memo, string) => [
                        ...memo,
                        ...fretboard
                            .getTriad(root, {
                                string,
                                layout:
                                    string > 2
                                        ? TriadLayout.One
                                        : TriadLayout.OnePlusTwo,
                                nextOctave: string === 2 && root === "C",
                            })
                            .map((x) => ({ ...x, triad: string })),
                    ],
                    []
                )
            )
            .render()
            .style({
                fill: ({ triad }) => fills[triad],
            });
    }

    function getHarmonisedScale(root) {
        const { notes } = getScale(root + " major");
        return ["", "m", "m", "", "", "m", "dim"].map(
            (x, i) => `${notes[i]}${x}`
        );
    }

    function renderHarmonised(root, string = 6, clear) {
        if (clear) {
            fretboard.clear();
        }
        const scale = getHarmonisedScale(root);
        fretboard
            .setDots([
                ...scale.reduce(
                    (memo, chord, index) => [
                        ...memo,
                        ...fretboard
                            .getTriad(chord, {
                                string,
                                layout: TriadLayout.One,
                            })
                            .map((x) => ({ ...x, triad: index + 1 })),
                    ],
                    []
                ),
                ...scale.reduce(
                    (memo, note, index) => [
                        ...memo,
                        ...fretboard
                            .getTriad(note, {
                                string: 3,
                                layout: TriadLayout.One,
                            })
                            .map((x) => ({ ...x, triad: index + 1 })),
                    ],
                    []
                ),
            ])
            .render()
            .style({
                fill: ({ triad }) => fills[triad],
            });
    }
}
