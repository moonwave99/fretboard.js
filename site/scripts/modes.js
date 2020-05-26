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
  const box = 'E';
  const ionianBox = CAGED({
    root: 'C3',
    box
  });

  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    el: '#fretboard'
  }).render(ionianBox).dots({
    fill: ({ note }) => note === 'C' ? '#F25116' : 'white',
    text: ({ note }) => note
  });

  const $select = document.querySelector('select');
  modeMap.forEach(({ mode }) => {
    const option = document.createElement('option');
    option.innerHTML = mode;
    $select.appendChild(option);
  });

  $select.addEventListener('change', (event) => {
    const { mode, root } = modeMap.find(({ mode }) => mode === event.target.value);
    fretboard.render(CAGED({
      root: `${root}3`,
      box,
      mode
    })).dots({
      fill: ({ note }) => note === root ? '#F25116' : 'white',
      text: ({ note }) => note
    });
  });
});
