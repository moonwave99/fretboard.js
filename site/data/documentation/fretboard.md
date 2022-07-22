# Documentation - Fretboard

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
const { Fretboard } = require("@moonwave99/fretboard.js");
// OR
import { Fretboard } from "@moonwave99/fretboard.js";
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

First set the dots with `setDots` and call the `render` method to display:

```javascript
// this would render an open C chord
fretboard.setDots([
    {
        string: 5,
        fret: 3,
    },
    {
        string: 4,
        fret: 2,
    },
    {
        string: 2,
        fret: 1,
    },
]);

fretboard.render();
```

Since `setDots` returns the fretboard instance itself, you can chain the two calls as:

```javascript
fretboard.setDots(dots).render();
```

## Configuration options

**Note**: even though the context should provide enough disambiguation, the word _string_ refers to both the instrument ones and the programming data type!

| Parameter         | Type                 | Default                              | Description                                                                                                                                                                           |
| ----------------- | -------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| el                | string               | '#fretboard'                         | Container element selector                                                                                                                                                            |
| tuning            | string[]             | ["E2", "A2", "D3", "G3", "B3", "E4"] | Tuning of the instrument (see [tuning](#tuning))                                                                                                                                      |
| stringCount       | number               | 6                                    | Number of instrument strings to display                                                                                                                                               |
| stringWidth       | number \| \[number\] | 1                                    | String line stroke width - an array of 6 numbers can be passed, e.g. `[1, 1, 1, 3, 4, 5]`                                                                                             |
| stringColor       | string               | '#666'                               | String color                                                                                                                                                                          |
| fretCount         | number               | 15                                   | Number of frets to display                                                                                                                                                            |
| fretWidth         | string               | 1                                    | Fret line stroke width                                                                                                                                                                |
| fretColor         | string               | '#666'                               | Fret color                                                                                                                                                                            |
| nutWidth          | string               | 7                                    | Nut stroke width                                                                                                                                                                      |
| nutColor          | string               | '#666'                               | Nut color                                                                                                                                                                             |
| middleFretColor   | string               | '#ff636c'                            | Middle fret color                                                                                                                                                                     |
| middleFretWidth   | string               | 3                                    | Middle fret stroke width                                                                                                                                                              |
| scaleFrets        | string               | true                                 | If `true`, spaces frets logarithmically, otherwise linear                                                                                                                             |
| topPadding        | string               | 20                                   | Top padding (relative to SVG container)                                                                                                                                               |
| bottomPadding     | string               | 15                                   | Bottom padding                                                                                                                                                                        |
| leftPadding       | string               | 20                                   | Left padding                                                                                                                                                                          |
| rightPadding      | string               | 20                                   | Right padding                                                                                                                                                                         |
| height            | string               | 150                                  | SVG element height                                                                                                                                                                    |
| width             | string               | 960                                  | SVG element width                                                                                                                                                                     |
| dotSize           | string               | 20                                   | Dot diameter                                                                                                                                                                          |
| dotStrokeColor    | string               | '#555'                               | Dot stroke color                                                                                                                                                                      |
| dotStrokeWidth    | string               | 2                                    | Dot stroke width                                                                                                                                                                      |
| dotTextSize       | string               | 12                                   | Dot text size                                                                                                                                                                         |
| dotFill           | string               | 'white'                              | Dot fill color                                                                                                                                                                        |
| dotText           | Function             | (dot) => ''                          | Returns the text for given dot                                                                                                                                                        |
| disabledOpacity   | string               | 0.9                                  | Opacity level for disabled dots                                                                                                                                                       |
| showFretNumbers   | string               | true                                 | Show fret numbers if true                                                                                                                                                             |
| fretNumbersHeight | string               | 40                                   | Fret numbers container height                                                                                                                                                         |
| fretNumbersMargin | string               | 20                                   | Fret number container top margin                                                                                                                                                      |
| fretNumbersColor  | string               | '#00000099'                          | Fret numbers color                                                                                                                                                                    |
| font              | string               | 'Arial'                              | Text font                                                                                                                                                                             |
| crop              | boolean              | false                                | If `true`, crops the rendering. Must be used in conjunction with `fretCount`, so set it to a value enough to contain your diagram (3/4 for a chord, 5/6 for a scale box for instance) |
| fretLeftPadding   | number               | 0                                    | Amount of empty frets to display before dots.                                                                                                                                         |
| barresColor       | string               | '#666'                               | Amount of empty frets to display before dots.                                                                                                                                         |

## Fretboard API

The `Fretboard` object has the following methods:

### setDots()

```typescript
setDots(dots: Position[]): Fretboard
```

Sets the passed dots. Returns the instance itself.

### render()

```typescript
render(): Fretboard
```

Renders the fretboard. Returns the instance itself.

### clear()

```typescript
clear(): Fretboard
```

Clears all positions from the fretboard. Returns the instance itself.

### style()

```typescript
style({
  filter = (): boolean => true,
  text,
  fontSize,
  fontFill,
  ...opts
}: {
  filter?: (position: Position) => boolean | Record<string, string|number|boolean>;
  text?: (position: Position) => string;
  fontSize?: number;
  fontFill?: string;
  [key: string]: string | number | Function;
}): Fretboard
```

Applies the passed properties to selected positions (via the `filter` function parameter). If no filter is provided, all positions are affected. Returns the instance itself. Example:

```typescript
const fretboard = new Fretboard();

fretboard
    .setDots(dots)
    .render()
    .style({
        // this gives us just the root notes
        filter: { interval: "1P" },
        // displays the note name
        text: ({ note }) => note,
        // sets the value of the fill attribute
        fill: "red",
    });
```

### renderScale()

```typescript
renderScale({
  type,
  root,
  box
 }: {
  type: string;
  root: string;
  box?: {
    box: string | number;
    system: Systems;
  }
}): Fretboard
```

Populates the fretboard with all the notes of the given scale, e.g.:

```javascript
const fretboard = new Fretboard();

// shows where all the C,D,E,F,G,A,B are across all strings
fretboard.renderScale({
    type: "major",
    root: "C",
});
```

To highlight a specific box, use the optional `box` param:

```javascript
import { Fretboard, Systems } from "@moonwave99/fretboard.js";

const fretboard = new Fretboard();

// shows where all the A,B,C#,D,E,F#,G# are across all strings,
// highlighting the C box of the CAGED system (between frets 9 and 12, that is)
fretboard.renderScale({
    type: "major",
    root: "A",
    box: {
        system: Systems.CAGED,
        box: "C",
    },
});
```

For more information, see [Fretboard Systems][fretboard-systems].

### renderChord()

```typescript
renderChord(chord: string, barres? Barre | Barre[]): Fretboard
```

Shorthand for rendering positions from a chord voicing string, e.g. `x32010` for a C Major in open position.

The string is mapped onto the fretboard starting from the bottom string, in this case:

-   `x`: 6th string muted;
-   `3`: 5th string 3rd fret;
-   `2`: 4th string 2nd fret;
-   `0`: 3rd string open;
-   `1`: 2nd string 1st fret;
-   `0`: 1st string open.

Examples:

```typescript
// renders an open C major
const fretboard = new Fretboard({
    fretCount: 3,
    showFretNumbers: false,
});

fretboard.renderChord("x32010");

// renders the Hendrix chord, displaying only frets 6, 7, 8
const fretboard = new Fretboard({
    fretCount: 3,
    showFretNumbers: true,
    crop: true,
});

fretboard.renderChord("x7678x");
```

**Note:** for frets above the 9th, the dash-splitted-notation should be used in order to prevent parsing ambiguity - for instance `10-x-10-10-8-x` for a `Dmadd11` chord.

Barres are supported by passing either a single `Barre` parameter, or an array of them:

```typescript
// renders a F major in first position
const fretboard = new Fretboard({
    fretCount: 3,
    showFretNumbers: false,
    crop: true,
});

fretboard.renderChord("133211", { fret: 1 });

// renders a B minor in second position
const fretboard = new Fretboard({
    fretCount: 3,
    showFretNumbers: false,
    crop: true,
});

fretboard.renderChord("x24432", { fret: 2, stringFrom: 5 });

// renders a C major in third position
const fretboard = new Fretboard({
    fretCount: 3,
    showFretNumbers: false,
    crop: true,
});

fretboard.renderChord("x35553", [
    { fret: 3, stringFrom: 5 },
    { fret: 5, stringFrom: 4, stringTo: 2 },
]);
```

**Note:** `stringFrom` defaults to the lowest string, and `stringTo` to the first. Pass the "human" agreed value otherwise, e.g. 2 for the open B string, or 5 for the open A (in standard guitar tuning of course).

### renderTriad()

```typescript
renderTriad(name: string, options = DEFAULT_GET_TRIAD_PARAMS): Fretboard

const DEFAULT_GET_TRIAD_PARAMS = {
  string: 6,
  layout: TriadLayouts.One,
  inversion: TriadInversions.Root,
  nextOctave: false
};
```

Renders a triad on the fretboard.

Examples:

```typescript
import {
    Fretboard,
    TriadLayouts,
    TriadInversion,
} from "@moonwave99/fretboard.js";
const fretboard = new Fretboard();

// renders a C major triad:
// - in root position
// - starting on the fifth string
// - with one note on the fifth string and two on the fourth
fretboard.renderTriad("C", {
    string: 5,
    layout: TriadLayouts.OnePlusTwo,
});

// renders a G minor triad:
// - in first inversion
// - starting on the fifth string
// - with the default layout (over three consecutive strings)
fretboard.renderTriad("Gm", {
    string: 5,
    inversion: TriadInversions.First,
});

// renders a C major triad:
// - starting on the second string
// - with the OnePlusTwo layout
// - starting at the 13th fret
fretboard.renderTriad("C", {
    string: 2,
    inversion: TriadInversions.OnePlusTwo,
    nextOctave: true,
});
```

The chord name is parsed via the `tokenize` function of the `@tonaljs/chord` module, so it is pretty flexible.

The layouts are:

-   `TriadLayouts.One` (default): one note per string;
-   `TriadLayouts.OnePlusTwo`: one note on the passed string, two on the next;
-   `TriadLayouts.TwoPlusOne`: two notes on the passed string, one on the next;
-   `TriadLayouts.Three`: three notes on the same string.

The inversions are:

-   `TriadInversions.Root` (default): root position (1-3-5);
-   `TriadInversions.First`: first inversion (3-5-1);
-   `TriadInversions.Second`: second inversion (5-1-3).

**Note:** for a chord to be inverted, only the bass note matters. The other notes can appear in any order.
For convenience, the inversions are provided in closed form and not spread over octaves.

### getTriad()

Like `renderTriad()`, but returns the triad instead of rendering it. Useful when rendering multiple triads on the same fretboard.

### muteStrings()

```typescript
muteStrings({
  strings,
  width,
  strokeWidth,
  stroke
}: {
  strings: number[];
  width?: number;
  strokeWidth?: number;
  stroke?: string;
}): Fretboard
```

Marks passed strings with a cross, e.g. `fretboard.muteStrings({ strings: [1, 6]})`.

## Events

You can listen to `click` and `mousemove` events on a fretboard instance. The callback function will be invoked with the corresponding `Position` (string/fret number), and the original `MouseEvent` as second parameter.

```typescript
fretboard.on(eventName, (position: Position, event: MouseEvent) => void)
```

For example:

```typescript
// this renders a dot following the mouse coordinates
const fretboard = new Fretboard();
fretboard.render([]);
fretboard.on("mousemove", (position) => fretboard.render([position]));

// you can remove the eventListeners with
fretboard.removeEventListeners();
```

## Tuning

One can pass a custom tuning as an array of notes, e.g.:

```javascript
const fretboard = new Fretboard({
    tuning: ["D2", "G2", "D3", "G3", "B3", "D4"],
});
```

**Note:** the tuning starts from the lower note as per naming convention.

The option is used by `renderScale()` to populate the fretboard according to the tuning.  
A set of common used tuning can be imported from the library itself:

```javascript
import { GUITAR_TUNINGS } from '@moonwave99/fretboard.js';

/*
GUITAR_TUNINGS = {
    default: ["E2", "A2", "D3", "G3", "B3", "E4"],
    halfStepDown: ["Eb2", "Ab2", "Db3", "Gb3", "Bb3", "Eb4"],
    dropD: ["D2", "A2", "D3", "G3", "B3", "E4"],
    openG: ["D2", "G2", "D3", "G3", "B3", "D4"],
    DADGAD: ["D2", "A2", "D3", "G3", "A3", "D4"]
};
*/
}
```

**Note**: `tuning.length` and `stringCount` must match, so beware bassists, ukulelists and 7+stringers.

## FAQ

> Why don't you provide a more expressive API like .highlightMajorTriads()?

The aim of this library is to be as abstract as possible, and to make no assumptions besides the bare string/fret positioning. Since you can pass as many properties as you want to the position entries, you can provide full controlled and rich visualisations.

EDIT: you have `fretboard.renderTriad()` actually now!

[fretboard-systems]: /documentation-music-tools.html#fretboard-systems
