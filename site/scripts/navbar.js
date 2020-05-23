import { Fretboard } from '../../dist/fretboard.esm.js';

document.addEventListener('DOMContentLoaded', () => {
  new Fretboard({
    el: '#icon',
    fretCount: 3,
    stringWidth: 2,
    fretWidth: 2,
    dotSize: 8,
    dotStrokeWidth: 2,
    leftPadding: 0,
    rightPadding: 0,
    topPadding: 0,
    bottomPadding: 0,
    width: 90,
    height: 60,
    showFretsNumber: false
  }).render([
    {
      string: 5,
      fret: 2,
      note: 'B'
    },
    {
      string: 4,
      fret: 1,
      note: 'D#'
    },
    {
      string: 3,
      fret: 2,
      note: 'A'
    },
    {
      string: 2,
      fret: 3,
      note: 'Cx'
    },
  ]).dots(({
    fill: (({ note }) => note === 'Cx' ? 'red' : 'white')
  }));

  document.querySelectorAll('.navbar-burger').forEach( el => {
    el.addEventListener('click', () => {
      const target = el.dataset.target;
      const $target = document.getElementById(target);
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');
    });
  });
});
