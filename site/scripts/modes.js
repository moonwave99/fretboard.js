import {
  Fretboard,
  CAGED
} from '../../dist/fretboard.esm.js';

import './navbar.js';
import '../styles/style.css';

const modeMap = [
  {
    root: 'C',
    mode: 'ionian',
    color: '#e76f51'
  },
  {
    root: 'D',
    mode: 'dorian',
    color: '#6a994e'
  },
  {
    root: 'E',
    mode: 'phrygian',
    color: '#8338ec'
  },
  {
    root: 'F',
    mode: 'lydian',
    color: '#ffbd00'
  },
  {
    root: 'G',
    mode: 'mixolydian',
    color: '#e36414'
  },
  {
    root: 'A',
    mode: 'aeolian',
    color: '#00bbf9'
  },
  {
    root: 'B',
    mode: 'locrian',
    color: '#1D5DF2'
  }
];

const fretboardConfiguration = {
  height: 200,
  stringsWidth: 1.5,
  dotSize: 25,
  fretCount: 16,
  fretsWidth: 1.2,
  font: 'Futura'
};

document.addEventListener('DOMContentLoaded', () => {
  let selectedBox = 'C';
  let selectedRoot = '';
  let selectedMode = 'ionian';

  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    el: '#fretboard'
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
    })).dots({
      fill: ({ note }) => note === selectedRoot.charAt(0) ? color : 'white',
      text: ({ note }) => note
    });
  }

  const $modeControl = document.querySelector('.modes');
  const $boxControl = document.querySelector('.boxes');

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
});
