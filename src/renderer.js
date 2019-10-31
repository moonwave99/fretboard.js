import { SVG } from '@svgdotjs/svg.js';

const generateStrings = function generateStrings ({
  stringCount,
  stringWidth,
  height
}) {
  const strings = [];

  for (let i = 0; i < stringCount; i++) {
    let y = (height / (stringCount - 1)) * i;
    if (i === 0) {
      y += stringWidth;
    }
    if (i === stringCount - 1) {
      y -= stringWidth;
    }
    strings.push(y);
  }
  return strings;
};

const generateFrets = function generateFrets ({
  scaleFrets,
  fretCount
}) {
  const k = Math.pow(2, 1 / 12);
  const frets = [0];

  for (let i = 1; i < fretCount; i++) {
    let x = (100 / fretCount) * i;
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
  stringCount = 6,
  stringWidth = 1,
  stringColor = 'black',
  fretCount = 15,
  fretWidth = 1,
  fretColor = 'black',
  nutWidth = 7,
  nutColor = 'black',
  middleFretColor = 'red',
  middleFretWidth = 2,
  scaleFrets = true,
  height = 150,
  width = 1200,
  dotSize = 20,
  dotStroke = 'black',
  dotFill = () => 'white',
  padding = 20,
  renderText = () => {}
}) {
  const draw = SVG()
    .addTo(el)
    .viewbox(-padding, -padding, width, height + 2 * padding)
    .size('100%', height);

  const strings = generateStrings({ stringCount, height, stringWidth });
  const frets = generateFrets({ fretCount, scaleFrets });
  const MIDDLE_FRET = 11;

  function renderDot ({
    fret = 0,
    string = 1,
    stroke = dotStroke,
    ...opts
  }) {
    let x = 0;
    if (fret === 0) {
      x = frets[0] / 2;
    } else {
      x = frets[fret] - (frets[fret] - frets[fret - 1]) / 2;
    }
    const y = strings[string - 1];

    draw
      .circle(dotSize)
      .cx(`${x}%`)
      .cy(y)
      .stroke({
        color: dotStroke,
        width: 2
      })
      .fill(dotFill(opts));

    const text = renderText(opts);
    if (text) {
      draw.text(text)
        .cx(width / 100 * x)
        .cy(y);
    }
  }

  strings.forEach((y, i) => {
    draw
      .line(0, y, '100%', y)
      .stroke({
        color: stringColor,
        width: stringWidth
      });
  });

  frets.forEach((x, i) => {
    if (i === 0) {
      draw
        .line(0, 1, 0, height - 1)
        .stroke({
          color: nutColor,
          width: nutWidth
        });
    } else {
      draw
        .line(`${x}%`, 1, `${x}%`, height - 1)
        .stroke({
          color: i === MIDDLE_FRET ? middleFretColor : fretColor,
          width: middleFretWidth
        });
    }
  });

  dots.forEach(renderDot);
}
