import {
  Fretboard,
  CAGED
} from '../../dist/fretboard.esm.js';

import './navbar.js';
import '../styles/style.css';

const modeMap = [
  {
    root: 'C',
    mode: 'ionian'
  },
  {
    root: 'D',
    mode: 'dorian'
  },
  {
    root: 'E',
    mode: 'phrygian'
  },
  {
    root: 'F',
    mode: 'lydian'
  },
  {
    root: 'G',
    mode: 'mixolydian'
  },
  {
    root: 'A',
    mode: 'aeolian'
  },
  {
    root: 'B',
    mode: 'locrian'
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
    const { root } = modeMap.find(({ mode }) => mode === selectedMode);
    selectedRoot = getRoot(root, selectedBox);
    fretboard.render(CAGED({
      root: selectedRoot,
      box: selectedBox,
      mode: selectedMode
    })).dots({
      fill: ({ note }) => note === selectedRoot.charAt(0) ? '#F25116' : 'white',
      text: ({ note }) => note
    });
  }

  const $boxSelect = document.querySelector('select[name="box"]');
  const $modeSelect = document.querySelector('select[name="mode"]');
  modeMap.forEach(({ mode }) => {
    const option = document.createElement('option');
    option.innerHTML = mode;
    $modeSelect.appendChild(option);
  });

  'CAGED'.split('').forEach(letter => {
    const option = document.createElement('option');
    option.innerHTML = letter;
    $boxSelect.appendChild(option);
  });

  $boxSelect.addEventListener('change', (event) => {
    selectedBox = event.target.value;
    updateFretboard();
  });

  $modeSelect.addEventListener('change', (event) => {
    const { mode, root } = modeMap.find(
      ({ mode }) => mode === event.target.value
    );
    selectedMode = mode;
    updateFretboard();
  });

  updateFretboard();
});
