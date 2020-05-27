import './navbar.js';
import '../../node_modules/prismjs/themes/prism-solarizedlight.css';
import '../styles/style.scss';

import prismjs from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('table').forEach(
    table => table.classList.add('table', 'is-fullwidth', 'is-striped')
  );
});
