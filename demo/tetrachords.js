import {
  Fretboard,
  tetrachord,
  TetrachordTypes,
  TetrachordLayouts
} from '../dist/fretboard.umd.js';

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

function example() {
  const options = {
    lowerTetrachordType: TetrachordTypes.Major,
    lowerTetrachordLayout: TetrachordLayouts.ThreePlusOne,
    upperTetrachordType: TetrachordTypes.Major,
    upperTetrachordLayout: TetrachordLayouts.ThreePlusOne
  };

  const lowerTetrachord = tetrachord({
    root: 'E',
    string: 5,
    fret: 7,
    type: TetrachordTypes.Major,
    layout: TetrachordLayouts.ThreePlusOne
  });

  const upperTetrachord = tetrachord({
    root: 'B',
    string: 4,
    fret: 9,
    type: TetrachordTypes.Major,
    layout: TetrachordLayouts.ThreePlusOne
  });

  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    el: '#fretboard',
    dotText: ({ note }) => note
  });
  fretboard.render([
    ...lowerTetrachord,
    ...upperTetrachord
  ]).dots({
    fill: (dot, index) => index < 4 ? 'yellow' : 'pink'
  });

  const $form = document.querySelector('.api-actions');

  $form.querySelectorAll('select').forEach(
    el => el.addEventListener('change', (event) => {
      const { name, value } = event.target;
      options[name] = value;

      fretboard.render([
        ...tetrachord({
          root: 'E',
          string: 5,
          fret: 7,
          type: options.lowerTetrachordType,
          layout: +options.lowerTetrachordLayout
        }),
        ...tetrachord({
          root: options.upperTetrachordType === TetrachordTypes.Lydian ? 'Bb' : 'B',
          string: 4,
          fret: options.upperTetrachordType === TetrachordTypes.Lydian ? 8 : 9,
          type: options.upperTetrachordType,
          layout: +options.upperTetrachordLayout
        })
      ]).dots({
        fill: (dot, index) => index < 4 ? 'yellow' : 'pink'
      });
    })
  );
}

document.addEventListener('DOMContentLoaded', () => {
  example();
});
