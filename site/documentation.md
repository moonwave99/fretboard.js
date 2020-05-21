# Documentation

## Installation

Use `npm`/`yarn`:

```bash
$ npm i @moonwave99/fretboard.js --save
```

`require` / `import` accordingly:

```javascript
const { Fretboard, CAGED } = require('@moonwave99/fretboard.js');

// OR

import { Fretboard, CAGED } from '@moonwave99/fretboard.js';

const box = CAGED({
  mode: 'major',
  root: 'C3',
  box: 'C'
});

const fretboard = new Fretboard({ el: '#el' });

fretboard.render(box);
```

## Usage

WIP
