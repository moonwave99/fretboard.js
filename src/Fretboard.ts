import { select, Selection, ValueFn, BaseType } from 'd3-selection';
import decamelize from 'decamelize';
import { Dot } from './scales/scales';

function generateStrings({
  stringCount,
  stringWidth,
  height
}: {
  stringCount: number;
  stringWidth: number;
  height: number;
}): number[] {
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
}

function generateFrets ({
  scaleFrets,
  fretCount
}: {
  scaleFrets: boolean;
  fretCount: number;
}): number[] {
  const fretRatio = Math.pow(2, 1 / 12);
  const frets = [0];

  for (let i = 1; i <= fretCount; i++) {
    let x = (100 / fretCount) * i;
    if (scaleFrets) {
      x = 100 - 100 / Math.pow(fretRatio, i);
    }
    frets.push(x);
  }
  return frets.map(x => x / frets[frets.length - 1] * 100);
}

function append(
  el: Selection<BaseType, unknown, HTMLElement | SVGElement, unknown>,
  tagName = 'g',
  opts = {} as { [key: string]: string|number }
): Selection<BaseType, unknown, HTMLElement | SVGElement, unknown> {
  if (!el) {
    return;
  }
  const tag = el.append(tagName);
  Object.keys(opts).forEach((key) =>
    tag.attr(decamelize(key, '-'), opts[key])
  );
  return tag;
}

const MIDDLE_FRET = 11;

const defaultOptions = {
  el: '',
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
  disabledOpacity: 0.9,
  showFretsNumber: true,
  fretsNumberHeight: 40,
  fretNumbersMargin: 20,
  fretNumbersColor: '#00000099',
  font: 'Arial'
};

function getDimensions ({
  topPadding,
  bottomPadding,
  leftPadding,
  rightPadding,
  width,
  height,
  showFretsNumber,
  fretsNumberHeight
}: {
  topPadding: number;
  bottomPadding: number;
  leftPadding: number;
  rightPadding: number;
  width: number;
  height: number;
  showFretsNumber: boolean;
  fretsNumberHeight: number;
}): {
  totalWidth: number;
  totalHeight: number;
} {
  const totalWidth = width + leftPadding + rightPadding;
  let totalHeight = height + topPadding + bottomPadding;

  if (showFretsNumber) {
    totalHeight += fretsNumberHeight;
  }
  return { totalWidth, totalHeight };
}

type Options = {
  el: string;
  stringCount: number;
  stringWidth: number;
  stringColor: string;
  fretCount: number;
  fretWidth: number;
  fretColor: string;
  nutWidth: number;
  nutColor: string;
  middleFretColor: string;
  middleFretWidth: number;
  scaleFrets: boolean;
  topPadding: number;
  bottomPadding: number;
  leftPadding: number;
  rightPadding: number;
  height: number;
  width: number;
  dotSize: number;
  dotStrokeColor: string;
  dotStrokeWidth: number;
  dotTextSize: number;
  dotFill: string;
  dotText: string;
  disabledOpacity: number;
  showFretsNumber: boolean;
  fretsNumberHeight: number;
  fretNumbersMargin: number;
  fretNumbersColor: string;
  font: string;
}

type Point = {
  x: number;
  y: number;
}

export class Fretboard {
  options: Options;
  strings: number[];
  frets: number[];
  positions: Point[][];
  svg: Selection<BaseType, unknown, HTMLElement, unknown>;
  constructor (options: object) {
    this.options = Object.assign(defaultOptions, options);
    const {
      el,
      height,
      width,
      leftPadding,
      topPadding,
      stringCount,
      stringWidth,
      fretCount,
      scaleFrets
    } = this.options;

    this.strings = generateStrings({ stringCount, height, stringWidth });
    this.frets = generateFrets({ fretCount, scaleFrets });
    const { frets, strings } = this;
    const { totalWidth, totalHeight } = getDimensions(this.options);

    function getDotCoords ({
      fret,
      string
    }: {
      fret: number;
      string: number;
    }): Point {
      let x = 0;
      if (fret === 0) {
        x = frets[0] / 2;
      } else {
        x = frets[fret] - (frets[fret] - frets[fret - 1]) / 2;
      }
      return { x, y: strings[string - 1] };
    }

    function generatePositions({
      fretCount,
      stringCount
    }: {
      fretCount: number;
      stringCount: number;
    }): Point[][] {
      const positions = [];
      for (let string = 1; string <= stringCount; string++) {
        const currentString = [];
        for (let fret = 0; fret < fretCount; fret++) {
          currentString.push(getDotCoords({ fret, string }))
        }
        positions.push(currentString);
      }
      return positions;
    }

    this.positions = generatePositions(this.options);

    this.svg = select(el)
      .append('svg')
      .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`)
      .append('g')
      .attr('class', 'fretboard-wrapper')
      .attr('transform', `translate(${leftPadding}, ${topPadding}) scale(${width / totalWidth})`);
  }

  render (dots: Dot[]): Fretboard {
    const {
      svg,
      frets,
      strings,
      positions
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
      dotStrokeColor,
      dotStrokeWidth,
      dotFill,
      dotSize,
      dotText,
      dotTextSize,
      disabledOpacity
    } = this.options;

    const { totalWidth } = getDimensions(this.options);

    const stringGroup = svg
      .append('g')
      .attr('class', 'strings');

    strings.forEach(y => {
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
      .attr('class', ({ disabled }) => disabled ? 'dot dot-disabled' : 'dot')
      .attr('opacity', ({ disabled }) => disabled ? disabledOpacity : 1);

    dotsNodes.append('circle')
      .attr('cx', ({ string, fret }) => `${positions[string - 1][fret].x}%`)
      .attr('cy', ({ string, fret }) => positions[string - 1][fret].y)
      .attr('r', dotSize * 0.5)
      .attr('class', ({ interval }) => `dot-circle dot-${interval}`)
      .attr('stroke', dotStrokeColor)
      .attr('stroke-width', dotStrokeWidth)
      .attr('fill', dotFill);

    dotsNodes.append('text')
      .attr('x', ({ string, fret }) => `${positions[string - 1][fret].x}%`)
      .attr('y', ({ string, fret }) => positions[string - 1][fret].y)
      .attr('class', ({ interval }) => `dot-text dot-text-${interval}`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', font)
      .attr('font-size', dotTextSize)
      .text(dotText);

    return this;
  }

  dots ({
    filter = (): boolean => true,
    text,
    fontSize,
    ...opts
  }: {
    filter: ValueFn<BaseType, unknown, boolean>;
    text: ValueFn<BaseType, unknown, string>;
    fontSize: number;
  }): Fretboard {
    const { svg } = this;
    const { dotTextSize } = this.options;
    const dots = svg.selectAll('.dot-circle')
      .filter(filter);

    Object.keys(opts).forEach(
      key => dots.attr(key, (opts as { [key: string]: string })[key])
    );

    if (text) {
      svg.selectAll('.dot-text')
        .filter(filter)
        .text(text)
        .attr('font-size', fontSize || dotTextSize);
    }

    return this;
  }
}
