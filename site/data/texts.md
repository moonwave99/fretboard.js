<!--home.hero-->
**Fretboard.js** is

- a guitar/bass fretboard **SVG visualisation**
- a set of **music oriented tools** - as scale boxes, arpeggios and chord shapes
- an **API** for user interaction.

<!--home.about-->
## About

I created this utility with two purposes in mind: as an **educator**, to enhance my tuition material, and as a **student** to better visualise my own exercises.

The UI ecosystem already has very good fretboard libraries, but my use case was different and none of them could fulfill all my needs, so in order to keep my skills fit I wrote it from scratch.

As I was moving from rhythm / mainly chord based playing to exploring lead guitar, the dev process helped me in getting a deeper understanding of the fretboard structure.

<!--examples.modes.caged-->
A different starting note inside a box corresponds to a different mode.  
For instance, if we play the **C-shaped** box starting from the first box note - E that is -, we get the corrisponding **phrygian** mode.

<!--examples.modes.threeNotesPerString-->
Same applies for the **3NPS** system. This system is more consistent: to every pattern it corresponds a mode.  
E.g. if you play pattern 2 you get the **dorian** mode of the starting note, check it yourself down here.

<!--examples.events-->
Click to add positions to the fretboard :cool:

<!--examples.tetrachords-->
An [heptatonic scale][1] is made up of two adjacent [tetrachords][2], a whole tone apart that is.

[1]: https://en.wikipedia.org/wiki/Heptatonic_scale
[2]: https://en.wikipedia.org/wiki/Tetrachord

<!--examples.playback-->
This example highlights the **diatonic seventh arpeggios** in the C major scale played in eight position.

Every arpeggio spells the **seventh chord** built by stacking thirds on top of every degree of the major scale, according to the scale structure (e.g. **C-E-G-B**, **D-F-A-C**, ...), yelding the following sequence (in C major):

- Cmaj7
- Dm7
- Em7
- Fmaj7
- G7
- Am7
- Bm7b5

<!--examples.chords.open-->
Fretboard.js can render chord diagrams of course. Here you have some good old [open chords][open-chords].

[open-chords]: https://en.wikipedia.org/wiki/Open_chord

<!--examples.chords.jazz-->
Want to become a jazz cat? No problem!

<!--examples.systems.description-->
The library supports the **pentatonic**, the **CAGED** and the **three notes per string (TNPS)** scale systems.

<!--examples.systems.pentatonic-->
The pentatonic system is organised in five boxes.  
Here you can see the various ways of playing an **E minor pentatonic** scale across all the fretboard.

<!--examples.systems.caged-->
The CAGED system is organised in five boxes, named around the corresponding open chord shapes.  
Here the same **C major** scale is played in different positions.

<!--examples.systems.tnps-->
The three notes per string system is organised in seven boxes, each starting from corresponding scale degree.  
_Et les modes son fait!_

<!--examples.systems.boxes.1-->
This example shows two adjacent **E minor pentatonic** boxes.

<!--examples.systems.boxes.2-->
This example shows the connection between the **C-shaped box** and the **A-shaped box** of the D major scale.