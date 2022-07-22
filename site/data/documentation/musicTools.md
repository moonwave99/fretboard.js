# Documentation - Music Tools

The library includes some helpers in order to populate the fretboard with existing patterns.

## Fretboard System

A **fretboard system** is an abstract representation of the fretboard, based on a given **tuning** (collection of notes to which the open strings are tuned) and the **number of frets** of the instrument.

It allows the depiction of a musical scale across all the fretboard, and the highlight of vertical boxes like the **CAGED** system and the **Three Notes per String (TNPS)** system.

```typescript
import { FretboardSystem } from "@moonwave99/fretboard.js";

// defaults to standard tuning and 15 frets
const system = new FretboardSystem();

// creates a long neck drop D guitar
const system = new FretboardSystem({
    tuning: ["D2", "A2", "D3", "G3", "B3", "E4"],
    fretCount: 24,
});
```

For more information about included alternate tunings see the [fretboard page][tunings]. They are just an array of notes though.

The system provides the `getScale(): Position[]` method:

```typescript
const system = new FretboardSystem();

// returns all the E,G,A,B,D occurrences across all strings
const scale = system.getScale({
    type: "pentatonic minor",
    root: "E",
});
```

The `type` parameter can be a mode (e.g. `ionian`), a mode alias (`major`) or a pentatonic mode (`pentatonic minor` or `pentatonic major`).

### Boxes

The optional `box` parameter controls the vertical box visualisation:

```typescript
import { FretboardSystem, Systems } from "@moonwave99/fretboard.js";

const system = new FretboardSystem();

// returns all the E,G,A,B,D occurrences across all strings, and highlights the first position pentatonic box
const scale = system.getScale({
    type: "pentatonic minor",
    root: "E",
    box: {
        box: 1,
        system: Systems.pentatonic,
    },
});
```

In this case, notes between frets 0 and 3 of the E minor pentatonic scale will have the `inBox` property set to `true`, that can be used in the `Fretboard` renderer for styling purposes.

In order to display the box up to the 12th position, the `root` can include the corrisponding octave:

```typescript
import { FretboardSystem, Systems } from "@moonwave99/fretboard.js";

const system = new FretboardSystem();
const scale = system.getScale({
    type: "pentatonic minor",
    root: "E3",
    box: {
        box: 1,
        system: Systems.pentatonic,
    },
});
```

This time, the box will be between frets 12 and 15.

Other supported systems:

```typescript
import { FretboardSystem, Systems } from "@moonwave99/fretboard.js";

const system = new FretboardSystem();

// returns the C-shaped box of the D major scale, starting on the F# in second position
system.getScale({
    type: "major",
    root: "D",
    box: {
        box: "C",
        system: Systems.CAGED,
    },
});

// returns the D major scale starting on the D in tenth position following the TNPS scheme
system.getScale({
    type: "major",
    root: "D",
    box: {
        box: 1,
        system: Systems.TNPS,
    },
});
```

**Note:** the scale naming detection is offered by [tonaljs][tonaljs], check their knowledge!

## Triads

The fretboard system _in standard tuning_ helps you building triads over different set of strings.

For instance, calling:

```typescript
import {
    FretboardSystem,
    TriadTypes,
    TriadLayouts,
    TriadInversions,
} from "@moonwave99/fretboard.js";

const system = new FretboardSystem();

const triad = system.getTriad({
  root: 'C',
  string: 5,
  type: TriadTypes.Major;
  layout: TriadLayouts.One;
  inversion: TriadInversions.Root;
});
```

yields:

```js
[
    { string: 6, fret: 8, note: "C", octave: 3, degree: 1 },
    { string: 5, fret: 7, note: "E", octave: 3, degree: 3 },
    { string: 4, fret: 5, note: "G", octave: 3, degree: 5 },
];
```

## Tetrachords

Returns the positions for the required [tetrachord][tetrachords].

```typescript
import {
  tetrachord,
  TetrachordTypes,
  TetrachordLayouts
} from '@moonwave99/fretboard.js';

const lowerTetrachord = tetrachord({
  root: 'E',
  string: 5,
  fret: 7,
  type: TetrachordTypes.Major,
  layout: TetrachordLayouts.ThreePlusOne
}): Position[]
```

Accepts:

-   **root**: the root note (needed for labeling purposes);
-   **string**: string number;
-   **fret**: fret number;
-   **type**: one of `TetrachordTypes`;
-   **layout**: one of `TetrachordLayouts` (linear, 1+3, 2+2, 3+1).

[pentatonic]: https://en.wikipedia.org/wiki/Pentatonic_scale
[caged]: https://appliedguitartheory.com/lessons/caged-guitar-theory-system/
[tetrachords]: https://en.wikipedia.org/wiki/Tetrachord
[tunings]: /fretboard.html#tunings
[tonaljs]: https://github.com/tonaljs/tonal/tree/master/packages/scale-type
