import { SVG } from '@svgdotjs/svg.js';

const generateStrings = function generateStrings ({
  stringsCount,
  stringsWidth,
  height
}) {
  const strings = [];

  for (let i = 0; i < stringsCount; i++) {
    let y = (height / (stringsCount - 1)) * i;
    if (i === 0) {
      y += stringsWidth;
    }
    if (i === stringsCount - 1) {
      y -= stringsWidth;
    }
    strings.push(y);
  }
  return strings;
};

const generateFrets = function generateFrets ({
  scaleFrets,
  fretsCount
}) {
  const k = Math.pow(2, 1 / 12);
  const frets = [0];

  for (let i = 1; i < fretsCount; i++) {
    let x = (100 / fretsCount) * i;
    if (scaleFrets) {
      x = 100 - 100 / Math.pow(k, i);
    }
    frets.push(x);
  }
  return frets.map((x, i) => x / frets[frets.length - 1] * 100);
};

export default function renderFretboard ({
  el,
  dots = [],
  stringsCount = 6,
  stringsWidth = 1,
  fretsCount = 15,
  fretsWidth = 1,
  scaleFrets = true,
  height = 150,
  width = 1200,
  dotSize = 20,
  padding = 20,
}) {
  const draw = SVG()
    .addTo(el)
    .viewbox(-padding, -padding, width, height + 2 * padding)
    .size('100%', height);

  const strings = generateStrings({ stringsCount, height, stringsWidth });
  const frets = generateFrets({ fretsCount, scaleFrets });
  const MIDDLE_FRET = 11;

  function renderDot ({ fret = 0, string = 1 }) {
    let x = 0;
    if (fret === 0) {
      x = `${frets[0] / 2}%`;
    } else {
      x = `${frets[fret] - (frets[fret] - frets[fret - 1]) / 2}%`;
    }
    const y = strings[string - 1];

    draw
      .circle(dotSize)
      .cx(x)
      .cy(y)
      .stroke({
        color: 'black',
        width: 2
      })
      .fill('white');
  }

  strings.forEach((y, i) => {
    draw
      .line(0, y, '100%', y)
      .stroke({
        color: 'black',
        width: stringsWidth
      });
  });

  frets.forEach((x, i) => {
    if (i === 0) {
      draw
        .line(0, 1, 0, height - 1)
        .stroke({ color: 'black', width: '5' });
    } else {
      draw
        .line(`${x}%`, 1, `${x}%`, height - 1)
        .stroke({ color: i === MIDDLE_FRET ? 'red' : 'black', width: fretsWidth });
    }
  });

  dots.forEach((stringContent, stringIndex) => {
    stringContent.forEach((x) => {
      renderDot({ fret: x, string: stringIndex + 1 });
    });
  });
};
