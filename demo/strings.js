import {
  Fretboard,
  CAGED,
  pentatonic,
  disableDots
} from '../dist/fretboard.esm.js';

import { isEqual, uniqWith } from 'lodash';

const fretboardConfiguration = {
  height: 200,
  stringsWidth: 1.5,
  dotSize: 25,
  fretCount: 16,
  fretsWidth: 1.2,
  font: 'Futura'
};

const colors = {
  defaultFill: 'white',
  defaultStroke: 'black',
  disabled: '#aaa',
  intervals: {
    '1P': '#F25116',
    '3M': '#F29727',
    '5P': '#F2E96B'
  },
  octaves: ['blue', 'magenta', 'red', 'orange', 'yellow', 'green']
};

function example({
  box = CAGED({
    mode: 'major',
    root: 'A3',
    box: 'C'
  })
}) {
  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    el: '#fretboard',
    dots: box
  });
  fretboard.render();
}
document.addEventListener('DOMContentLoaded', () => {
  example({
    box: CAGED({
      mode: 'major',
      root: 'A3',
      box: 'C'
    })
  });
});
