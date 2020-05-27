import { isEqual, uniqWith } from 'lodash';
import { Fretboard, CAGED } from '../../dist/fretboard.esm.js';
import './navbar.js';
import '../styles/style.css';

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

function apiExample(box = CAGED({ mode: 'major', root: 'C3', box: 'C'})) {
  const fretboard = new Fretboard({
    el: '#fretboard-api',
    ...fretboardConfiguration
  });
  fretboard.render(box);

  document.querySelectorAll('.api-actions button')
    .forEach((button) => {
      button.addEventListener('click', ({ currentTarget }) => {
        switch (currentTarget.dataset.action) {
          case 'show-notes':
            fretboard.style({
              text: ({ note }) => note,
              fill: colors.defaultFill
            });
            break;
          case 'show-notes-with-octave':
            fretboard.style({
              text: ({ noteWithOctave }) => noteWithOctave,
              fontSize: 10,
              fill: ({ octave }) => colors.octaves[octave]
            });
            break;
          case 'show-intervals':
            fretboard.style({
              text: ({ interval }) => interval,
              fill: colors.defaultFill
            });
            break;
          case 'highlight-triad':
            fretboard.style({
              filter: ({ position }) => [1, 3, 5].indexOf(position) > -1,
              stroke: 'red'
            });
            break;
          default:
            fretboard.style({
              text: () => null,
              fill: colors.defaultFill,
              stroke: 'black'
            });
            break;
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  apiExample(CAGED({
    mode: 'major',
    root: 'C3',
    box: 'C'
  }));
});
