import 'abcjs/abcjs-midi.css';
import ABCJS from 'abcjs/midi';
import { getChord } from '@tonaljs/chord';

import {
  Fretboard,
  CAGED
} from '../../../dist/fretboard.esm.js';

import { fretboardConfiguration, soundFontUrl, colors } from '../config.js';
import { diatonicArpeggios } from '../music.js';
import '../navbar.js';
import '../../styles/style.scss';
import '../../styles/playback.scss';

document.addEventListener('DOMContentLoaded', () => {
  const fretboard = new Fretboard(fretboardConfiguration)
    .setDots(CAGED({
      root: 'C3',
      box: 'E'
    })).render();

  const visualObj = ABCJS.renderAbc('notation', diatonicArpeggios, {
    program: 25,
    responsive: 'resize',
    add_classes: true,
    clickListener: (element) => {
      if (!element.chord) {
        return;
      }
      const octave = element.minpitch < 7 ? 3 : 4;
      const [root, chordType] = [element.chord[0].name[0], element.chord[0].name.substring(1)];
      const chord = getChord(chordType, `${root}${octave}`);
      fretboard.style({
        stroke: ({ noteWithOctave }) => chord.notes.indexOf(noteWithOctave) > -1 ? colors.intervals['1P'] : 'black',
        ['stroke-width']: ({ noteWithOctave }) => chord.notes.indexOf(noteWithOctave) > -1 ? 4 : 1
      });
    }
  })[0];

  const chordLabels = document.querySelectorAll('#notation .abcjs-annotation');
  const noteElements = document.querySelectorAll('#notation .abcjs-note');
  const synthControl = new ABCJS.synth.SynthController();

  chordLabels.forEach((x) => {
    const chordType = x.querySelector('tspan').innerHTML.substring(1);
    x.classList.add('abcjs-chord', `abcjs-chord-type-${chordType}`);
  });

  let chord = null;
  let chordType = null;

  synthControl.load("#audio", {
    onEvent: ({ midiPitches, elements, ...rest }) => {
      const note = ABCJS.synth.pitchToNoteName[midiPitches[0].pitch];
      const chordElement = elements[0].find(({ classList }) => classList.contains('abcjs-annotation'));
      const noteElement = elements[0].find(({ classList }) => classList.contains('abcjs-note'));

      if (!chordElement) {
        fretboard.style({
          fill: ({ noteWithOctave }) => noteWithOctave === note ? colors.chordTypes[chordType] : 'white',
        });
      } else {
        chordLabels.forEach((x) => {
          x.classList.toggle('abcjs-chord-playing', x === chordElement)
        });
        chordType = chordElement.querySelector('tspan').innerHTML.substring(1);
        chord = getChord(chordType, note);

        fretboard.style({
          text: ({ noteWithOctave, note }) => chord.notes.indexOf(noteWithOctave) > -1 ? note : '',
          fill: ({ noteWithOctave }) => noteWithOctave === note ? colors.chordTypes[chordType] : 'white',
          stroke: ({ noteWithOctave }) => chord.notes.indexOf(noteWithOctave) > -1 ? colors.chordTypes[chordType] : 'black',
          ['stroke-width']: ({ noteWithOctave }) => chord.notes.indexOf(noteWithOctave) > -1 ? 4 : 1
        });
      }

      noteElements.forEach((x) => {
        x.classList.toggle('abcjs-note_playing', x === noteElement)
      });
    }
  }, {
    displayLoop: true,
    displayRestart: true,
    displayPlay: true,
    displayProgress: true
  });

  synthControl.setTune(visualObj, false, { soundFontUrl });
  synthControl.toggleLoop();
});
