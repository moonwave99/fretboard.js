<!--chords.main-->
This code renders an **open C major chord**:

```javascript
const fretboard = new Fretboard({
  el: document.querySelector(...),
  width: 300,
  height: 200,
  bottomPadding: 0,
  scaleFrets: false,
  stringWidth: 2,
  fretWidth: 2,
  fretCount: 3,
  dotSize: 25,
  dotStrokeWidth: 3,
  fretNumbersMargin: 30,
  showFretNumbers: false
})

fretboard.renderChord('x32010');

// this is a shorthand for:
fretboard.renderChord([
  { string: 5, fret: 3 },
  { string: 4, fret: 2 },
  { string: 2, fret: 1 }
]);

// optional
fretboard.muteStrings({ strings: [6] });
```

Barres are supported by passing either a single `Barre` parameter, or an array of them:

```typescript
// renders a F major in first position
const fretboard = new Fretboard({
  fretCount: 3,
  showFretNumbers: false,
  crop: true
});

fretboard.renderChord('133211', { fret: 1 });

// renders a B minor in second position
const fretboard = new Fretboard({
  fretCount: 3,
  showFretNumbers: false,
  crop: true
});

fretboard.renderChord('x24432', { fret: 2, stringFrom: 5 });

// renders a C major in third position
const fretboard = new Fretboard({
  fretCount: 3,
  showFretNumbers: false,
  crop: true
});

fretboard.renderChord('x35553', [
  { fret: 3, stringFrom: 5 },
  { fret: 5, stringFrom: 4, stringTo: 2 }
]);
```
**Note:** `stringFrom` defaults to the lowest string, and `stringTo` to the first. Pass the "human" agreed value otherwise, e.g. 2 for the open B string, or 5 for the open A (in standard guitar tuning of course).

Providing chord positions by name is outside the scope of this library, as many resources already exist for that.
