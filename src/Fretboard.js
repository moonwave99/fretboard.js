import { select } from 'd3-selection';
import decamelize from 'decamelize';

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
  const fretRatio = Math.pow(2, 1 / 12);
  const frets = [0];

  for (let i = 1; i <= fretCount; i++) {
    let x = (100 / fretCount) * i;
    if (scaleFrets) {
      x = 100 - 100 / Math.pow(fretRatio, i);
    }
    frets.push(x);
  }
  return frets.map((x, i) => x / frets[frets.length - 1] * 100);
};

const append = function append (el = null, tagName = 'g', opts = {}) {
  if (!el) {
    return;
  }
  const tag = el.append(tagName);
  Object.keys(opts).forEach((key) =>
    tag.attr(decamelize(key, '-'), opts[key])
  );
  return tag;
};

const MIDDLE_FRET = 11;

export class Fretboard {
  constructor (options) {
    const defaultOptions = {
      el: null,
      dots: [],
      stringCount: 6,
      stringWidth: 1,
      stringColor: 'black',
      fretCount: 15,
      fretWidth: 1,
      fretColor: 'black',
      nutWidth: 7,
      nutColor: 'black',
      middleFretColor: 'red',
      middleFretWidth: 3,
      scaleFrets: true,
      topPadding: 20,
      bottomPadding: 15,
      leftPadding: 20,
      rightPadding: 20,
      height: 150,
      width: 960,
      dotSize: 20,
      dotStrokeColor: 'black',
      dotStrokeWidth: 2,
      dotTextSize: 12,
      dotFill: 'white',
      dotText: '',
      showFretsNumber: true,
      fretsNumberHeight: 40,
      fretNumbersMargin: 20,
      fretNumbersColor: '#00000099',
      font: 'Arial'
    };
    this.options = Object.assign(defaultOptions, options);
    const {
      el,
      dots,
      topPadding,
      bottomPadding,
      leftPadding,
      rightPadding,
      width,
      height,
      stringCount,
      stringWidth,
      fretCount,
      scaleFrets,
      showFretsNumber,
      fretsNumberHeight
    } = this.options;

    this.totalHeight = height + topPadding + bottomPadding;
    this.totalWidth = width + leftPadding + rightPadding;

    if (showFretsNumber) {
      this.totalHeight += fretsNumberHeight;
    }

    const strings = generateStrings({ stringCount, height, stringWidth });
    const frets = generateFrets({ fretCount, scaleFrets });

    this.frets = frets;
    this.strings = strings;

    function getDotCoords ({ fret, string }) {
      let x = 0;
      if (fret === 0) {
        x = frets[0] / 2;
      } else {
        x = frets[fret] - (frets[fret] - frets[fret - 1]) / 2;
      }
      return { x, y: strings[string - 1] };
    }

    this.options.dots = dots.map(({ fret, string, ...opts }) => {
      return {
        fret,
        string,
        coords: getDotCoords({ fret, string }),
        ...opts
      };
    });

    this.svg = select(el)
      .append('svg')
      .attr('width', this.totalWidth)
      .attr('height', this.totalHeight)
      .append('g')
      .attr('class', 'fretboard-wrapper')
      .attr('transform', `translate(${leftPadding}, ${topPadding}) scale(${width / this.totalWidth})`);
  }

  render () {
    const {
      svg,
      frets,
      strings,
      totalWidth
    } = this;

    const {
      height,
      font,
      nutColor,
      nutWidth,
      stringColor,
      stringWidth,
      fretColor,
      fretWidth,
      middleFretWidth,
      middleFretColor,
      showFretsNumber,
      fretNumbersMargin,
      fretNumbersColor,
      topPadding,
      dots,
      dotStrokeColor,
      dotStrokeWidth,
      dotFill,
      dotSize,
      dotText,
      dotTextSize
    } = this.options;

    const stringGroup = svg
      .append('g')
      .attr('class', 'strings');

    strings.forEach((y, i) => {
      append(stringGroup, 'line', {
        x1: 0,
        y1: y,
        x2: '100%',
        y2: y,
        stroke: stringColor,
        strokeWidth: stringWidth
      });
    });

    const fretsGroup = svg
      .append('g')
      .attr('class', 'frets');

    const fretNumbersGroup = svg
      .append('g')
      .attr('class', 'fret-numbers')
      .attr('transform', `translate(0 ${fretNumbersMargin + topPadding + strings[strings.length - 1]})`);

    frets.forEach((x, i) => {
      if (i === 0) {
        append(fretsGroup, 'line', {
          x1: 0,
          y1: 1,
          x2: 0,
          y2: height - 1,
          stroke: nutColor,
          strokeWidth: nutWidth
        });
        return;
      }
      append(fretsGroup, 'line', {
        x1: `${x}%`,
        y1: 1,
        x2: `${x}%`,
        y2: height - 1,
        stroke: i === MIDDLE_FRET ? middleFretColor : fretColor,
        strokeWidth: i === MIDDLE_FRET ? middleFretWidth : fretWidth
      });
      if (showFretsNumber) {
        const middlePosition = frets[i] - (frets[i] - frets[i - 1]) / 2;
        append(fretNumbersGroup, 'text', {
          fill: i === MIDDLE_FRET + 1 ? middleFretColor : fretNumbersColor,
          fontFamily: font,
          textAnchor: 'middle',
          x: totalWidth / 100 * middlePosition
        }).text(`${i}`);
      }
    });

    const dotGroup = svg
      .append('g')
      .attr('class', 'dots');

    const dotsNodes = dotGroup.selectAll('g')
      .data(dots)
      .enter()
      .append('g')
      .attr('class', 'dot');

    dotsNodes.append('circle')
      .attr('cx', ({ coords }) => `${coords.x}%`)
      .attr('cy', ({ coords }) => coords.y)
      .attr('r', dotSize * 0.5)
      .attr('class', ({ interval }) => `dot-circle dot-${interval}`)
      .attr('stroke', dotStrokeColor)
      .attr('stroke-width', dotStrokeWidth)
      .attr('fill', dotFill);

    dotsNodes.append('text')
      .attr('x', ({ coords }) => `${coords.x}%`)
      .attr('y', ({ coords }) => coords.y)
      .attr('class', ({ interval }) => `dot-text dot-text-${interval}`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', font)
      .attr('font-size', dotTextSize)
      .text(dotText);

    return this;
  }

  dots ({
    filter = () => true,
    text,
    ...opts
  }) {
    const {
      svg
    } = this;

    const dots = svg.selectAll('.dot-circle')
      .filter(filter);

    Object.keys(opts).forEach(
      key => dots.attr(key, opts[key])
    );

    if (text) {
      svg.selectAll('.dot-text')
        .filter(filter)
        .text(text);
    }

    return this;
  }
}
