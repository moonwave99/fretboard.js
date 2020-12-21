import 'abcjs/abcjs-midi.css';
import ABCJS from 'abcjs/midi';
import { getChord } from '@tonaljs/chord';

import { Fretboard, Systems } from '../../../dist/fretboard.esm.js';

import { fretboardConfiguration, abcjsConfig, colors } from '../config.js';
import { diatonicArpeggios } from '../music.js';
import '../navbar.js';
import '../../styles/style.scss';
import '../../styles/playback.scss';

document.addEventListener('DOMContentLoaded', () => {
  const fretboard = new Fretboard({
    ...fretboardConfiguration,
    dotFill: ({ inSystem }) => inSystem ? colors.defaultFill : colors.disabled
  }).renderScale({
    root: 'C',
    box: 'E',
    system: Systems.CAGED,
  });

  const visualObj = ABCJS.renderAbc('notation', diatonicArpeggios, {
    ...abcjsConfig,
    clickListener: (element) => {
      if (!element.chord) {
        return;
      }
      const octave = element.minpitch < 7 ? 3 : 4;
      const [root, chordType] = [element.chord[0].name[0], element.chord[0].name.substring(1)];
      const chord = getChord(chordType, `${root}${octave}`);
      fretboard.style({
        filter: { inSystem: true },
        stroke: ({ note, octave }) =>
          chord.notes.indexOf(`${note}${octave}`) > -1
            ? colors.intervals['1P']
            : colors.defaultStroke,
        ['stroke-width']: ({ note, octave }) =>
          chord.notes.indexOf(`${note}${octave}`) > -1 ? 4 : 1,
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
      const playedNote = ABCJS.synth.pitchToNoteName[midiPitches[0].pitch];
      const chordElement = elements[0].find(({ classList }) => classList.contains('abcjs-annotation'));
      const noteElement = elements[0].find(({ classList }) => classList.contains('abcjs-note'));

      if (!chordElement) {
        fretboard.style({
          filter: { inSystem: true },
          fill: ({ note, octave }) =>
            `${note}${octave}` === playedNote
              ? colors.chordTypes[chordType]
              : colors.defaultFill,
        });
      } else {
        chordLabels.forEach(x => x.classList.toggle('abcjs-chord-playing', x === chordElement));
        chordType = chordElement.querySelector('tspan').innerHTML.substring(1);
        chord = getChord(chordType, playedNote).notes;

        fretboard.style({
          filter: { inSystem: true },
          text: ({ note, octave }) => chord.indexOf(`${note}${octave}`) > -1 ? note : '',
          fill: ({ note, octave }) =>
            `${note}${octave}` === playedNote
              ? colors.chordTypes[chordType]
              : colors.defaultFill,
          stroke: ({ note, octave }) =>
            chord.indexOf(`${note}${octave}`) > -1
              ? colors.chordTypes[chordType]
              : colors.defaultStroke,
          ['stroke-width']: ({ note, octave }) => chord.indexOf(`${note}${octave}`) > -1 ? 2 : 1,
        });
      }

      noteElements.forEach(x => x.classList.toggle('abcjs-note_playing', x === noteElement));
    }
  }, {
    displayRestart: true,
    displayPlay: true,
    displayProgress: true
  });

  synthControl.setTune(visualObj, false, abcjsConfig);
});
