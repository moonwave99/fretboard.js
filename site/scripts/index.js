import '../../node_modules/prismjs/themes/prism-solarizedlight.css';
import '../styles/style.scss';
import './navbar.js';
import './documentation.js';

import home from './home.js';
import modes from './examples/modes.js';
import boxes from './examples/boxes.js';
import chords from './examples/chords.js';
import tetrachords from './examples/tetrachords.js';

document.addEventListener('DOMContentLoaded', () => {
  switch (document.documentElement.dataset.section) {
    case 'home':
      return home();
    case 'modes':
      return modes();
    case 'boxes':
      return boxes();
    case 'chords':
      return chords();
    case 'tetrachords':
      return tetrachords();
  }
});
