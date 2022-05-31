import { get as getScale } from "@tonaljs/scale";
import { Fretboard, TriadLayouts } from "../../../dist/fretboard.esm.js";
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

function getHarmonisedScale(root) {
    const { notes } = getScale(root + " major");
    return ["M", "m", "m", "M", "M", "m", "dim"].map((type, i) => ({
        chord: `${notes[i]}${type}`,
        type,
    }));
}

export default function triads() {
    triadsMain(document.querySelector(".triads-different-strings"));
    triadsHarmonised(document.querySelector(".triads-harmonised-scale"));
    triadsInversion(document.querySelector(".triads-inversions"));
}

function triadsMain(wrapper) {
    const fretboard = new Fretboard({
        ...fretboardConfiguration,
        dotText: ({ note }) => note,
        el: wrapper.querySelector("figure"),
    });

    const $form = wrapper.querySelector(".api-actions");

    $form.querySelectorAll("select").forEach((el) =>
        el.addEventListener("change", () => {
            renderTriadOverStrings(
                Object.fromEntries(new FormData($form).entries())
            );
        })
    );

    renderTriadOverStrings({ root: "C" });

    function renderTriadOverStrings({ root }) {
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
                                        ? TriadLayouts.One
                                        : TriadLayouts.OnePlusTwo,
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
}

function triadsHarmonised(wrapper) {
    const fretboard = new Fretboard({
        ...fretboardConfiguration,
        dotText: ({ note }) => note,
        el: wrapper.querySelector("figure"),
    });

    const $form = wrapper.querySelector(".api-actions");

    $form.querySelectorAll("select").forEach((el) =>
        el.addEventListener("change", () => {
            renderHarmonised(Object.fromEntries(new FormData($form).entries()));
        })
    );

    renderHarmonised({
        root: "C",
        string: 6,
    });
    function renderHarmonised({ root, string }) {
        const scale = getHarmonisedScale(root);
        fretboard
            .setDots([
                ...scale.reduce(
                    (memo, { chord, type }, index) => [
                        ...memo,
                        ...fretboard
                            .getTriad(chord, {
                                string: +string,
                                layout: TriadLayouts.One,
                            })
                            .map((x) => ({
                                ...x,
                                triad: index + 1,
                                type,
                            })),
                    ],
                    []
                ),
            ])
            .render()
            .style({
                fill: ({ type }) => colors.triads[type],
            });
    }
}

function triadsInversion(wrapper) {
    const fretboard = new Fretboard({
        ...fretboardConfiguration,
        dotText: ({ note }) => note,
        el: wrapper.querySelector("figure"),
    });

    const $form = wrapper.querySelector(".api-actions");
    $form
        .querySelectorAll("select")
        .forEach((el) =>
            el.addEventListener("change", () =>
                renderTriad(Object.fromEntries(new FormData($form).entries()))
            )
        );

    function renderTriad({ root, type, inversion, string, layout }) {
        fretboard.renderTriad(`${root}${type}`, {
            string: +string,
            inversion,
            layout,
        });
    }

    renderTriad({
        root: "C",
        type: "Major",
        inversion: "Root",
        string: 6,
        layout: "One",
    });
}
