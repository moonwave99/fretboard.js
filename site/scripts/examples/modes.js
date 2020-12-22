import { get as getScale } from '@tonaljs/scale';
import { Fretboard, Systems } from '../../../dist/fretboard.esm.js';
import { fretboardConfiguration, colors, modeMap } from '../config.js';

const EMajorScale = getScale('E2 ionian').notes;

function modesCAGED() {
  const $wrapper = document.getElementById('modes-caged');

  let state = {
    box: 'C',
    root: 'E',
    mode: 'phrygian',
  };

  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    el: '#fretboard-caged',
    dotFill: ({ inBox }) => (inBox ? colors.defaultFill : colors.disabled),
  });

  function getRoot(root, box) {
    switch (box) {
      case 'C':
        return 'CD'.split('').indexOf(root) > -1 ? root + 3 : root + 2;
      case 'D':
      case 'E':
      case 'A':
      case 'G':
        return root + 2;
    }
  }

  function updateFretboard(newState) {
    state = {
      ...state,
      ...newState,
    };
    const { root, color } = modeMap.find(({ mode }) => mode === state.mode);
    state.root = getRoot(root, state.box);
    fretboard
      .renderScale({
        ...state,
        type: state.mode,
        box: {
          system: Systems.CAGED,
          box: state.box,
        },
      })
      .style({
        filter: { inBox: true },
        fill: ({ note }) =>
          note === state.root.match(/(.*)[\d]/)[1] ? color : 'white',
        text: ({ note, octave }) => note + octave,
      });
  }

  const $modeControl = $wrapper.querySelector('.modes');
  const $boxControl = $wrapper.querySelector('.boxes');

  $modeControl.innerHTML = modeMap
    .map(({ mode }) => {
      return `
      <label class="radio mode-${mode}">
        <input type="radio" name="mode" value="${mode}" ${
        state.mode === mode ? 'checked' : ''
      }>
        ${mode}
      </label>
    `;
    })
    .join('');

  $boxControl.innerHTML = 'CAGED'
    .split('')
    .map((box) => {
      return `
      <label class="radio box-${box}">
        <input type="radio" name="box" value="${box}" ${
        state.box === box ? 'checked' : ''
      }>
        <strong>${box}</strong> shaped box
      </label>
    `;
    })
    .join('');

  $modeControl.querySelectorAll('input').forEach((el) => {
    el.addEventListener('change', (event) => {
      const { mode, root } = modeMap.find(
        ({ mode }) => mode === event.target.value
      );
      updateFretboard({ mode });
    });
  });

  $boxControl.querySelectorAll('input').forEach((el) => {
    el.addEventListener('change', (event) =>
      updateFretboard({ box: event.target.value })
    );
  });

  updateFretboard();
}

function modesTNPString() {
  const $wrapper = document.getElementById('modes-3nps');

  let state = {
    box: 1,
    root: 'E',
    mode: 'ionian'
  };

  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    fretCount: 18,
    el: '#fretboard-3nps',
    dotFill: ({ inBox }) => inBox ? colors.defaultFill : colors.disabled
  });

  function getRoot(box) {
    const modeIndex = modeMap.findIndex(({ mode }) => mode === state.mode);
    let noteIndex = modeIndex;
    if (modeIndex < box - 1) {
      noteIndex += 7;
    }
    return EMajorScale[noteIndex % 7];
  }

  function updateFretboard(newState) {
    state = {
      ...state,
      ...newState
    };
    const { root, color } = modeMap.find(({ mode }) => mode === state.mode);
    state.root = getRoot(state.box);
    fretboard
      .renderScale({
        ...state,
        type: state.mode,
        box: {
          system: Systems.TNPS,
          box: state.box
        },
      })
      .style({
        filter: { inBox: true },
        fill: ({ note }) =>
          note === state.root.match(/(.*)[\d]/)[1] ? color : colors.defaultFill,
        text: ({ note, octave }) => note + octave,
      });
  }

  const $modeControl = $wrapper.querySelector('.modes');
  const $boxControl = $wrapper.querySelector('.boxes');

  $modeControl.innerHTML = modeMap.map(({ mode }) => {
    return `
      <label class="radio mode-${mode}">
        <input type="radio" name="mode" value="${mode}" ${state.mode === mode ? 'checked' : ''}>
        ${mode}
      </label>
    `;
  }).join('');

  $boxControl.innerHTML = [1, 2, 3, 4, 5, 6, 7].map(box => {
    return `
      <label class="radio box-${box}">
        <input type="radio" name="box" value="${box}" ${state.box === box ? 'checked' : ''}>
        pattern <strong>${box}</strong>
      </label>
    `;
  }).join('');

  $modeControl.querySelectorAll('input').forEach(el => {
    el.addEventListener('change', event => {
      const { mode, root } = modeMap.find(
        ({ mode }) => mode === event.target.value
      );
      updateFretboard({ mode });
    });
  });

  $boxControl.querySelectorAll('input').forEach(el => {
    el.addEventListener('change', event => updateFretboard({ box: +event.target.value }));
  });

  updateFretboard();
}

export default function modes() {
  modesCAGED();
  modesTNPString();
}
