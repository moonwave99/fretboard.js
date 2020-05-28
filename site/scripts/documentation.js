import prismjs from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('table').forEach(
    table => table.classList.add('table', 'is-fullwidth', 'is-striped')
  );
});
