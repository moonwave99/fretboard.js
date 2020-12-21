import { isEqual, uniqWith } from 'lodash';
import {
  Fretboard,
  Systems,
  disableDots,
  FretboardSystem
} from '../../../dist/fretboard.esm.js';
import { fretboardConfiguration, colors } from "../config.js";
import SystemForm from "../forms/systems.js";

function pentatonicSystemExample() {
  const $wrapper = document.querySelector('.fretboard-systems-pentatonic');
  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    el: $wrapper.querySelector('figure'),
    dotText: ({ note, octave, interval }) => note,
    dotFill: ({ interval, inSystem }) =>
      !inSystem
        ? colors.disabled
        : interval === '1P'
        ? colors.defaultActiveFill
        : colors.defaultFill,
  });

  const defaultScale = {
    root: 'E',
    type: 'minor pentatonic'
  };

  fretboard.renderScale({
    ...defaultScale,
    box: 1,
    system: Systems.pentatonic,
  });

  SystemForm({
    prefix: 'pentatonic',
    el: $wrapper.querySelector('.form-wrapper'),
    boxes: ['1', '2', '3', '4', '5', "1'"],
    modes: ['minor pentatonic', 'major pentatonic'],
    defaultState: {
      root: defaultScale.root,
      mode: defaultScale.type,
    },
    onChange: ({ mode, box, root }) => {
      fretboard.renderScale({
        type: mode,
        root: box.slice(-1) === "'" ? `${root}3` : root,
        box: box[0],
        system: Systems.pentatonic,
      });
    },
  });
}

function CAGEDSystemExample() {
  const $wrapper = document.querySelector('.fretboard-systems-caged');
  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    el: $wrapper.querySelector('figure'),
    dotText: ({ note, octave, interval }) => note,
    dotFill: ({ interval, inSystem }) =>
      !inSystem
        ? colors.disabled
        : interval === '1P'
        ? colors.defaultActiveFill
        : colors.defaultFill,
  });

  fretboard.renderScale({
    type: 'major',
    root: 'C',
    box: 'C',
    system: Systems.CAGED
  });

  SystemForm({
    prefix: 'caged',
    el: $wrapper.querySelector('.form-wrapper'),
    boxes: 'CAGED'.split(''),
    onChange: ({ mode, box, root }) => {
      fretboard.renderScale({
        type: mode,
        root,
        box,
        system: Systems.CAGED
      });
    },
  });
}

function TNPSSystemExample() {
  const $wrapper = document.querySelector('.fretboard-systems-tnps');
  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    el: $wrapper.querySelector('figure'),
    dotText: ({ note, octave, interval }) => note,
    dotFill: ({ interval, inSystem }) =>
      !inSystem
        ? colors.disabled
        : interval === "1P"
        ? colors.defaultActiveFill
        : colors.defaultFill,
  });

  fretboard.renderScale({
    type: 'major',
    root: 'C',
    box: 1,
    system: Systems.TNPS
  });

  SystemForm({
    prefix: 'tnps',
    el: $wrapper.querySelector('.form-wrapper'),
    boxes: [1, 2, 3, 4, 5, 6, 7],
    onChange: ({ mode, box, root }) => {
      fretboard.renderScale({
        type: mode,
        root,
        box,
        system: Systems.TNPS,
      });
    },
  });
}

function connectedCagedExample({ box1, box2 } = {}) {
  function enableCommonDots({ string, fret, ...dot }) {
    const isInBox1 =
      box1.findIndex((x) => x.string === string && x.fret === fret) > -1;
    const isInBox2 =
      box2.findIndex((x) => x.string === string && x.fret === fret) > -1;
    if (isInBox1 && isInBox2) {
      return { string, fret, ...dot, disabled: false };
    }
    return { string, fret, ...dot };
  }

  const connectedDots = uniqWith(
    [
      disableDots({
        box: box1,
        from: { string: 3, fret: 2 },
      }),
      disableDots({
        box: box2,
        to: { string: 4, fret: 5 },
      }),
    ].flat(),
    (dot1, dot2) => {
      return isEqual(
        {
          fret: dot1.fret,
          string: dot1.string,
        },
        {
          fret: dot2.fret,
          string: dot2.string,
        }
      );
    }
  ).map(enableCommonDots);

  const fretboard = new Fretboard({
    el: '#fretboard-connected-caged',
    dotText: ({ note, disabled }) => !disabled ? note : '',
    dotFill: ({ interval, disabled }) => {
      if (disabled) {
        return colors.disabled;
      }
      return interval === '1P'
        ? colors.intervals[interval]
        : colors.defaultFill;
    },
    dotStrokeColor: ({ disabled }) =>
      disabled ? colors.disabled : colors.defaultStroke,
    ...fretboardConfiguration,
    fretCount: 18,
  });
  fretboard.setDots(connectedDots).render();
}

function connectedPentatonicExample({
  box1 = pentatonic({ box: 4, root: 'E3', mode: 'minor' }),
  box2 = pentatonic({ box: 5, root: 'E3', mode: 'minor' }),
} = {}) {
  const commonDots = uniqWith([...box1, ...box2].flat(), (dot1, dot2) => {
    return isEqual(
      {
        fret: dot1.fret,
        string: dot1.string,
      },
      {
        fret: dot2.fret,
        string: dot2.string,
      }
    );
  });

  const fretboard = new Fretboard({
    el: '#fretboard-connected-pentatonic',
    dotText: ({ note }) => note,
    dotFill: ({ note }) =>
      note === 'E' ? colors.intervals['1P'] : colors.defaultFill,
    ...fretboardConfiguration,
    fretCount: 18,
  });
  fretboard.setDots(commonDots).render();
}

function connectedBoxesExample() {
  const system = new FretboardSystem();
  connectedCagedExample({
    box1: system
      .getScale({ root: 'D', box: 'C', system: Systems.CAGED })
      .filter(({ inSystem }) => inSystem),
    box2: system
      .getScale({ root: 'D', box: 'A', system: Systems.CAGED })
      .filter(({ inSystem }) => inSystem),
  });
  connectedPentatonicExample({
    box1: system
      .getScale({
        root: 'E3',
        type: 'minor pentatonic',
        box: 5,
        system: Systems.pentatonic,
      })
      .filter(({ inSystem }) => inSystem),
    box2: system
      .getScale({
        root: 'E4',
        type: 'minor pentatonic',
        box: 1,
        system: Systems.pentatonic,
      })
      .filter(({ inSystem }) => inSystem),
  });
}

export default function systems() {
    pentatonicSystemExample();
    CAGEDSystemExample();
    TNPSSystemExample();
    connectedBoxesExample();
}
