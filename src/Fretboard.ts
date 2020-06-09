import {
  select,
  Selection,
  ValueFn,
  BaseType
} from 'd3-selection';
import { Position } from './scales/scales';

function dotClasses(dot: Position, prefix: string): string {
  return [
    `dot-${prefix}`,
      ...Object.entries(dot)
        .map(([key, value]: [string, string]) => `dot-${prefix}-${key}-${value}`)
  ].join(' ');
}

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

const MIDDLE_FRET = 11;

export const defaultOptions = {
  el: '#fretboard',
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
  crop: false,
  fretLeftPadding: 0,
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
  dotText: (): string => '',
  disabledOpacity: 0.9,
  showFretNumbers: true,
  fretNumbersHeight: 40,
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
  showFretNumbers,
  fretNumbersHeight
}: {
  topPadding: number;
  bottomPadding: number;
  leftPadding: number;
  rightPadding: number;
  width: number;
  height: number;
  showFretNumbers: boolean;
  fretNumbersHeight: number;
}): {
  totalWidth: number;
  totalHeight: number;
} {
  const totalWidth = width + leftPadding + rightPadding;
  let totalHeight = height + topPadding + bottomPadding;

  if (showFretNumbers) {
    totalHeight += fretNumbersHeight;
  }
  return { totalWidth, totalHeight };
}

type Options = {
  el: string | BaseType;
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
  dotText: ValueFn<BaseType, unknown, string>;
  disabledOpacity: number;
  showFretNumbers: boolean;
  fretNumbersHeight: number;
  fretNumbersMargin: number;
  fretNumbersColor: string;
  crop: boolean;
  fretLeftPadding: number;
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
  private baseRendered: boolean;
  constructor (options = {}) {
    this.options = Object.assign({}, defaultOptions, options);
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
        for (let fret = 0; fret <= fretCount; fret++) {
          currentString.push(getDotCoords({ fret, string }))
        }
        positions.push(currentString);
      }
      return positions;
    }

    this.positions = generatePositions(this.options);

    this.svg = (
      typeof el === 'string'
        ? select(el)
        : select<BaseType, unknown>(el)
      )
      .append('svg')
      .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`)
      .append('g')
      .attr('class', 'fretboard-wrapper')
      .attr('transform', `translate(${leftPadding}, ${topPadding}) scale(${width / totalWidth})`);
  }

  _baseRender(dotOffset: number): void {
    if (this.baseRendered) {
      return;
    }

    const {
      svg,
      frets,
      strings
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
      showFretNumbers,
      fretNumbersMargin,
      fretNumbersColor,
      topPadding
    } = this.options;

    const { totalWidth } = getDimensions(this.options);

    const stringGroup = svg
      .append('g')
      .attr('class', 'strings');

    stringGroup
      .selectAll('line')
      .data(strings)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('y1', d => d)
      .attr('x2', '100%')
      .attr('y2', d => d)
      .attr('stroke', stringColor)
      .attr('stroke-width', stringWidth);

    const fretsGroup = svg
      .append('g')
      .attr('class', 'frets');

    fretsGroup
      .selectAll('line')
      .data(frets)
      .enter()
      .append('line')
      .attr('x1', d => `${d}%`)
      .attr('y1', 1)
      .attr('x2', d => `${d}%`)
      .attr('y2', height - 1)
      .attr('stroke', (_d, i) => {
        switch(i) {
          case 0:
            return nutColor;
          case MIDDLE_FRET:
            return middleFretColor;
          default:
            return fretColor;
        }
      })
      .attr('stroke-width', (_d, i) => {
        switch(i) {
          case 0:
            return nutWidth;
          case MIDDLE_FRET:
            return middleFretWidth;
          default:
            return fretWidth;
        }
      });

    if (showFretNumbers) {
      const fretNumbersGroup = svg
        .append('g')
        .attr('class', 'fret-numbers')
        .attr('font-family', font)
        .attr('transform',
          `translate(0 ${fretNumbersMargin + topPadding + strings[strings.length - 1]})`
        );

      fretNumbersGroup
        .selectAll('text')
        .data(frets.slice(1))
        .enter()
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', (d, i) => totalWidth / 100 * (d - (d - frets[i]) / 2))
        .attr('fill', (_d, i) => i === MIDDLE_FRET ? middleFretColor : fretNumbersColor)
        .text((_d, i) => `${i + 1 + dotOffset}`)
    }

    this.baseRendered = true;
  }

  render(dots: Position[] = []): Fretboard {
    const {
      svg,
      positions
    } = this;

    const {
      font,
      dotStrokeColor,
      dotStrokeWidth,
      dotFill,
      dotSize,
      dotText,
      dotTextSize,
      disabledOpacity,
      fretLeftPadding,
      crop
    } = this.options;

    const dotOffset = crop
      ? Math.max(0, Math.min(...dots.map(({ fret }) => fret)) - 1 - fretLeftPadding)
      : 0;
    this._baseRender(dotOffset);

    if (!dots.length) {
      return this;
    }

    svg.select('.dots').remove();

    const dotGroup = svg
      .append('g')
      .attr('class', 'dots')
      .attr('font-family', font);

    const dotsNodes = dotGroup.selectAll('g')
      .data(dots)
      .enter()
      .filter(({ fret }) => fret >= 0)
      .append('g')
      .attr('class', ({ disabled }) => disabled ? 'dot dot-disabled' : 'dot')
      .attr('opacity', ({ disabled }) => disabled ? disabledOpacity : 1);

    dotsNodes.append('circle')
      .attr('cx', ({ string, fret }) => `${positions[string - 1][fret - dotOffset].x}%`)
      .attr('cy', ({ string, fret }) => positions[string - 1][fret - dotOffset].y)
      .attr('r', dotSize * 0.5)
      .attr('class', (dot: Position) => dotClasses(dot, 'circle'))
      .attr('stroke', dotStrokeColor)
      .attr('stroke-width', dotStrokeWidth)
      .attr('fill', dotFill);

    dotsNodes.append('text')
      .attr('x', ({ string, fret }) => `${positions[string - 1][fret - dotOffset].x}%`)
      .attr('y', ({ string, fret }) => positions[string - 1][fret - dotOffset].y)
      .attr('class', (dot: Position) => dotClasses(dot, 'text'))
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', dotTextSize)
      .text(dotText);

    return this;
  }

  style ({
    filter = (): boolean => true,
    text,
    fontSize,
    fontFill,
    ...opts
  }: {
    filter?: ValueFn<BaseType, unknown, boolean>;
    text?: ValueFn<BaseType, unknown, string>;
    fontSize?: number;
    fontFill?: string;
    [key: string]: string | number | Function;
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
        .attr('font-size', fontSize || dotTextSize)
        .attr('fill', fontFill || 'black');
    }

    return this;
  }
}
