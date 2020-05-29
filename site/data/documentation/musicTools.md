# Documentation - Music Tools

The library includes some helpers in order to populate the fretboard with existing patterns.  
They all return an array of `{ string, fret, ...various }`, that can be passed to `Fretboard.render()` (or to your own function as well!).

## Scales

### Pentatonic

Returns the positions for one of the five [pentatonic][pentatonic] boxes.

```typescript
import { pentatonic } from '@moonwave99/fretboard.js';

pentatonic ({
  box = 1,
  root = 'C3',
  mode = 'major',
}): Position[]
```

Accepts:

- **box**: 1-5;
- **root**: the root, relative to the box;
- **mode**: the mode of the pentatonic scale - major or minor.

### Three-Note-Per-String

Returns the positions for one of the five **3NPS** boxes.

```typescript
import { TNPString } from '@moonwave99/fretboard.js';

TNPString ({
  box = 1,
  root = 'E3',
  mode = 'major',
}): Position[]
```

Accepts:

- **box**: 1-7;
- **root**: the root, relative to the box;
- **mode**: the mode of the box itself.

### CAGED

Returns the positions for one of the five [CAGED][caged] system boxes.

```typescript
import { CAGED } from '@moonwave99/fretboard.js';

CAGED ({
  box = 'C',
  root = 'C3',
  mode = 'major',
}): Position[]
```

Accepts:

- **box**: one of C-A-G-E-D;
- **root**: the root, relative to the box;
- **mode**: the mode of the box itself.

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

- **root**: the root note (needed for labeling purposes);
- **string**: string number;
- **fret**: fret number;
- **type**: one of `TetrachordTypes`;
- **layout**: one of `TetrachordLayouts` (linear, 1+3, 2+2, 3+1).

[pentatonic]: https://en.wikipedia.org/wiki/Pentatonic_scale
[caged]: https://appliedguitartheory.com/lessons/caged-guitar-theory-system/
[tetrachords]: https://en.wikipedia.org/wiki/Tetrachord
