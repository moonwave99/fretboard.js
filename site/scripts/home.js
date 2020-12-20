import { isEqual, uniqWith } from 'lodash';
import { Fretboard, CAGED } from '../../dist/fretboard.esm.js';
import { fretboardConfiguration, colors } from './config.js';

export default function home() {
  const box = CAGED({
    mode: 'major',
    root: 'C3',
    box: 'C'
  });

  const fretboard = new Fretboard({
    el: '#fretboard-api',
    ...fretboardConfiguration
  });
  fretboard.renderScale({
    type: 'major',
    root: 'C'
  });

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
              text: ({ note, octave }) => `${note}${octave}`,
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
              filter: ({ degree }) => [1, 3, 5].indexOf(degree) > -1,
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
