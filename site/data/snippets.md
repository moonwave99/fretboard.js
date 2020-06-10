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

fretboard.render([
  { string: 5, fret: 3 },
  { string: 4, fret: 2 },
  { string: 2, fret: 1 }
]);

// optional
fretboard.muteStrings({ strings: [6] });
```
Providing chord positions by name is outside the scope of this library, as many resources already exist for that.
