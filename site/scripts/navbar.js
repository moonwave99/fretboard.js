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
    showFretNumbers: false,
    crop: true
  }).renderChord('076780')
    .style(({
      fill: (({ string }) => string === 2 ? 'red' : 'white')
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
