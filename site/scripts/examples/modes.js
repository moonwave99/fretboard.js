import {
  Fretboard,
  CAGED,
  TNPString
} from '../../../dist/fretboard.esm.js';

import { fretboardConfiguration, modeMap } from '../config.js';

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

  function getRoot(root, box) {
    return ['E2', 'F#2', 'G#2', 'A2', 'B2', 'C#3', 'D#3'][box - 1];
  }

  function updateFretboard() {
    const { root, color } = modeMap.find(({ mode }) => mode === selectedMode);
    selectedRoot = getRoot(root, selectedBox);
    fretboard.render(TNPString({
      root: selectedRoot,
      box: selectedBox,
      mode: selectedMode
    })).style({
      fill: ({ note }) => note === selectedRoot.match(/(.*)[\d]/)[1] ? color : 'white',
      text: ({ note }) => note
    });
  }

  const $modeControl = $wrapper.querySelector('.modes');
  const $boxControl = $wrapper.querySelector('.boxes');

  $modeControl.innerHTML = modeMap.map(({ mode, color }) => {
    return `
      <label class="radio mode-${mode}" style="color: ${color}">
        <input type="radio" name="mode" value="${mode}" ${selectedMode === mode ? 'checked' : ''}>
        ${mode}
      </label>
    `;
  }).join('');

  $boxControl.innerHTML = [1, 2, 3, 4, 5, 6, 7].map(box => {
    return `
      <label class="radio box-${box}">
        <input type="radio" name="mode" value="${box}" ${selectedBox === box ? 'checked' : ''}>
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
  let selectedMode = 'ionian';

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
    fretboard.render(CAGED({
      root: selectedRoot,
      box: selectedBox,
      mode: selectedMode
    })).style({
      fill: ({ note }) => note === selectedRoot.match(/(.*)[\d]/)[1] ? color : 'white',
      text: ({ note }) => note
    });
  }

  const $modeControl = $wrapper.querySelector('.modes');
  const $boxControl = $wrapper.querySelector('.boxes');

  $modeControl.innerHTML = modeMap.map(({ mode, color }) => {
    return `
      <label class="radio mode-${mode}" style="color: ${color}">
        <input type="radio" name="mode" value="${mode}" ${selectedMode === mode ? 'checked' : ''}>
        ${mode}
      </label>
    `;
  }).join('');

  $boxControl.innerHTML = 'CAGED'.split('').map(box => {
    return `
      <label class="radio box-${box}">
        <input type="radio" name="mode" value="${box}" ${selectedBox === box ? 'checked' : ''}>
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
