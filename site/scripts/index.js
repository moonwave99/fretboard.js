import '../../node_modules/prismjs/themes/prism-solarizedlight.css';
import '../styles/style.scss';
import './navbar.js';
import './documentation.js';

import home from './home.js';
import modes from './examples/modes.js';
import boxes from './examples/boxes.js';
import chords from './examples/chords.js';
import events from './examples/events.js';
import tetrachords from './examples/tetrachords.js';
import systems from "./examples/systems.js";

document.addEventListener('DOMContentLoaded', () => {
  ({
    home,
    modes,
    boxes,
    chords,
    events,
    tetrachords,
    systems,
    documentation: () => {}
  })[document.documentElement.dataset.section]();
});
