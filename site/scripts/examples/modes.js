import { get as getScale } from '@tonaljs/scale';

import {
  Fretboard,
  CAGED,
  TNPString
} from '../../../dist/fretboard.esm.js';

import { fretboardConfiguration, modeMap } from '../config.js';

const twoOctavesScale = [
  ...getScale('E2 ionian').notes,
  ...getScale('E3 ionian').notes
];

function modesTNPString() {
  const $wrapper = document.getElementById('modes-3nps');

  let selectedBox = 1;
  let selectedRoot = '';
  let selectedMode = 'ionian';

  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    fretCount: 18,
    el: '#fretboard-3nps'
  });

  function getRoot(box) {
    const modeIndex = modeMap.findIndex(({ mode }) => mode === selectedMode);
    let noteIndex = modeIndex;
    if (modeIndex < box - 1) {
      noteIndex += 7;
    }
    return twoOctavesScale[noteIndex];
  }

  function updateFretboard() {
    const { root, color } = modeMap.find(({ mode }) => mode === selectedMode);
    selectedRoot = getRoot(selectedBox);
    fretboard.setDots(TNPString({
      root: selectedRoot,
      box: selectedBox,
      mode: selectedMode
    })).render().style({
      fill: ({ note }) => note === selectedRoot.match(/(.*)[\d]/)[1] ? color : 'white',
      text: ({ note }) => note
    });
  }

  const $modeControl = $wrapper.querySelector('.modes');
  const $boxControl = $wrapper.querySelector('.boxes');

  $modeControl.innerHTML = modeMap.map(({ mode }) => {
    return `
      <label class="radio mode-${mode}">
        <input type="radio" name="mode" value="${mode}" ${selectedMode === mode ? 'checked' : ''}>
        ${mode}
      </label>
    `;
  }).join('');

  $boxControl.innerHTML = [1, 2, 3, 4, 5, 6, 7].map(box => {
    return `
      <label class="radio box-${box}">
        <input type="radio" name="box" value="${box}" ${selectedBox === box ? 'checked' : ''}>
        pattern <strong>${box}</strong>
      </label>
    `;
  }).join('');

  $modeControl.querySelectorAll('input').forEach(el => {
    el.addEventListener('change', (event) => {
      const { mode, root } = modeMap.find(
        ({ mode }) => mode === event.target.value
      );
      selectedMode = mode;
      updateFretboard();
    });
  });

  $boxControl.querySelectorAll('input').forEach(el => {
    el.addEventListener('change', (event) => {
      selectedBox = +event.target.value;
      updateFretboard();
    });
  });

  updateFretboard();
}

function modesCAGED() {
  const $wrapper = document.getElementById('modes-caged');

  let selectedBox = 'C';
  let selectedRoot = '';
  let selectedMode = 'phrygian';

  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    el: '#fretboard-caged'
  });

  function getRoot(root, box) {
    switch (box) {
      case 'C':
        return ('CD'.split('').indexOf(root) > -1) ? root + 3 : root + 2;
      case 'A':
        return ('FGAB'.split('').indexOf(root) > -1) ? root + 2 : root + 3;
      case 'G':
        return ('AB'.split('').indexOf(root) > -1) ? root + 2 : root + 3;
      case 'E':
        return root + '3';
      case 'D':
        return root === 'C' ? root + 4 : root + 3;
    }
  }

  function updateFretboard() {
    const { root, color } = modeMap.find(({ mode }) => mode === selectedMode);
    selectedRoot = getRoot(root, selectedBox);
    fretboard.setDots(CAGED({
      root: selectedRoot,
      box: selectedBox,
      mode: selectedMode
    })).render().style({
      fill: ({ note }) => note === selectedRoot.match(/(.*)[\d]/)[1] ? color : 'white',
      text: ({ note }) => note
    });
  }

  const $modeControl = $wrapper.querySelector('.modes');
  const $boxControl = $wrapper.querySelector('.boxes');

  $modeControl.innerHTML = modeMap.map(({ mode }) => {
    return `
      <label class="radio mode-${mode}">
        <input type="radio" name="mode" value="${mode}" ${selectedMode === mode ? 'checked' : ''}>
        ${mode}
      </label>
    `;
  }).join('');

  $boxControl.innerHTML = 'CAGED'.split('').map(box => {
    return `
      <label class="radio box-${box}">
        <input type="radio" name="box" value="${box}" ${selectedBox === box ? 'checked' : ''}>
        <strong>${box}</strong> shaped box
      </label>
    `;
  }).join('');

  $modeControl.querySelectorAll('input').forEach(el => {
    el.addEventListener('change', (event) => {
      const { mode, root } = modeMap.find(
        ({ mode }) => mode === event.target.value
      );
      selectedMode = mode;
      updateFretboard();
    });
  });

  $boxControl.querySelectorAll('input').forEach(el => {
    el.addEventListener('change', (event) => {
      selectedBox = event.target.value;
      updateFretboard();
    });
  });

  updateFretboard();
}

export default function modes() {
  modesTNPString();
  modesCAGED();
}
