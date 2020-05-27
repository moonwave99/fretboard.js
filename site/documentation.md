# Documentation

## Installation

Use `npm`/`yarn`:

```bash
$ npm i @moonwave99/fretboard.js --save
```

## Usage

Given an existing DOM element:

```html
<figure id="fretboard"></figure>
```

`require` / `import` the library accordingly:

```javascript
const { Fretboard, CAGED } = require('@moonwave99/fretboard.js');
// OR
import { Fretboard, CAGED } from '@moonwave99/fretboard.js';
```

Then initialise a `Fretboard` instance with desired options:

```javascript
const fretboard = new Fretboard({
  el: '#fretboard',
  fretColor: 'blue',
  dotFill: 'red',
  ...
});
```
Call the render method with the information you want to display eventually:

```javascript
const box = CAGED({
  mode: 'major',
  root: 'C3',
  box: 'C'
});

fretboard.render(box);
```

In this case, the `CAGED` method returns an array of objects containing further musical information like the note name and the scale degree, but you can pass just an array of `{ string, fret }`:

```javascript
// this would render an open C chord
fretboard.render([
  {
    string: 5,
    fret: 3
  },
  {
    string: 4,
    fret: 2
  },
  {
    string: 2,
    fret: 1
  }
]);
```

## Configuration options

**Note**: even though the context should provide enough disambiguation, the word _string_ refers to both the instrument ones and the programming data type!

Parameter         | Type     | Default      | Description
------------------|----------|--------------|----------------------------------------------------------
el                | string   | '#fretboard' | Container element selector
stringCount       | string   | 6            | Number of instrument strings to display
stringWidth       | string   | 1            | String line stroke width
stringColor       | string   | 'black'      | String color
fretCount         | string   | 15           | Number of frets to display
fretWidth         | string   | 1            | Fret line stroke width
fretColor         | string   | 'black'      | Fret color
nutWidth          | string   | 7            | Nut stroke width
nutColor          | string   | 'black'      | Nut color
middleFretColor   | string   | 'red'        | Middle fret color
middleFretWidth   | string   | 3            | Middle fret stroke width
scaleFrets        | string   | true         | If `true`, spaces frets logarithmically, otherwise linear
topPadding        | string   | 20           | Top padding (relative to SVG container)
bottomPadding     | string   | 15           | Bottom padding
leftPadding       | string   | 20           | Left padding
rightPadding      | string   | 20           | Right padding
height            | string   | 150          | SVG element height
width             | string   | 960          | SVG element width
dotSize           | string   | 20           | Dot diameter
dotStrokeColor    | string   | 'black'      | Dot stroke color
dotStrokeWidth    | string   | 2            | Dot stroke width
dotTextSize       | string   | 12           | Dot text size
dotFill           | string   | 'white'      | Dot fill color
dotText           | Function | (dot) => ''  | Returns the text for given dot
disabledOpacity   | string   | 0.9          | Opacity level for disabled dots
showFretNumbers   | string   | true         | Show fret numbers if true
fretNumbersHeight | string   | 40           | Fret numbers container height
fretNumbersMargin | string   | 20           | Fret number container top margin
fretNumbersColor  | string   | '#00000099'  | Fret numbers color
font              | string   | 'Arial'      | Text font
