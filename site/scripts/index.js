import '../../node_modules/prismjs/themes/prism-solarizedlight.css';
import '../styles/style.scss';
import './navbar.js';
import './documentation.js';

import home from './home.js';
import modes from './examples/modes.js';
import chords from './examples/chords.js';
import events from './examples/events.js';
import tetrachords from './examples/tetrachords.js';
import highlight from './examples/highlight.js';
import systems from './examples/systems.js';

document.addEventListener('DOMContentLoaded', () => {
  ({
    home,
    modes,
    chords,
    events,
    tetrachords,
    highlight,
    systems,
    documentation: () => {},
  }[document.documentElement.dataset.section]());
});
