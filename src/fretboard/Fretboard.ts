import {
  select,
  Selection,
  ValueFn,
  BaseType
} from 'd3-selection';

import { throttle } from 'throttle-debounce';

import {
  generateStrings,
  generateFrets,
  getStringThickness,
  dotClasses,
  getDimensions,
  getPositionFromMouseCoords,
  createHoverDiv
} from './utils';

import { parseChord } from '../chords/chords';

import {
  MIDDLE_FRET,
  THROTTLE_INTERVAL,
  GUITAR_TUNINGS,
  DEFAULT_COLORS,
  DEFAULT_DIMENSIONS,
  DEFAULT_FRET_COUNT,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE
} from '../constants';

import { FretboardSystem } from '../fretboardSystem/FretboardSystem';
import { Systems } from '../fretboardSystem/systems/systems';

export type Tuning = string[];

export type Position = {
  string: number;
  fret: number;
  note?: string;
  disabled?: boolean;
  octave?: number;
  octaveInScale?: number;
  inBox?: boolean;
  interval?: string;
  degree?: number;
  chroma?: number;
} & Record<string, string | number | boolean | Array<string | number>>;

type FretboardHandler = (position: Position) => void;

export type Barre = {
  fret: number;
  stringFrom?: number;
  stringTo?: number;
}

export const defaultOptions = {
  el: '#fretboard',
  tuning: GUITAR_TUNINGS.default,
  stringCount: 6,
  stringWidth: DEFAULT_DIMENSIONS.line,
  stringColor: DEFAULT_COLORS.line,
  fretCount: DEFAULT_FRET_COUNT,
  fretWidth: DEFAULT_DIMENSIONS.line,
  fretColor: DEFAULT_COLORS.line,
  nutWidth: DEFAULT_DIMENSIONS.nut,
  nutColor: DEFAULT_COLORS.line,
  middleFretColor: DEFAULT_COLORS.highlight,
  middleFretWidth: 3 * DEFAULT_DIMENSIONS.line,
  scaleFrets: true,
  crop: false,
  fretLeftPadding: 0,
  topPadding: DEFAULT_DIMENSIONS.unit,
  bottomPadding: DEFAULT_DIMENSIONS.unit * .75,
  leftPadding: DEFAULT_DIMENSIONS.unit,
  rightPadding: DEFAULT_DIMENSIONS.unit,
  height: DEFAULT_DIMENSIONS.height,
  width: DEFAULT_DIMENSIONS.width,
  dotSize: DEFAULT_DIMENSIONS.unit,
  dotStrokeColor: DEFAULT_COLORS.dotStroke,
  dotStrokeWidth: 2 * DEFAULT_DIMENSIONS.line,
  dotTextSize: DEFAULT_FONT_SIZE,
  dotFill: DEFAULT_COLORS.dotFill,
  dotText: (): string => '',
  disabledOpacity: 0.9,
  showFretNumbers: true,
  fretNumbersHeight: 2 * DEFAULT_DIMENSIONS.unit,
  fretNumbersMargin: DEFAULT_DIMENSIONS.unit,
  fretNumbersColor: DEFAULT_COLORS.line,
  font: DEFAULT_FONT_FAMILY,
  barresColor: DEFAULT_COLORS.barres
};

export const defaultMuteStringsParams = {
  strings: [] as number[],
  width: 15,
  strokeWidth: 5,
  stroke: DEFAULT_COLORS.mutedString
};

export type Options = {
  el: string | BaseType;
  tuning: Tuning;
  stringCount: number;
  stringWidth: number | [number];
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
  barresColor: string;
}

type Rec = Record<string, string | number | boolean>;

type Point = {
  x: number;
  y: number;
}

type MuteStringsParams = {
  strings: number[];
  width?: number;
  strokeWidth?: number;
  stroke?: string;
}

function getDotCoords({
  fret,
  string,
  frets,
  strings  
}: {
  fret: number;
  string: number;
  frets: number[];  
  strings: number[];
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
  stringCount,
  frets,
  strings
}: {
  fretCount: number;
  stringCount: number;
  frets: number[];
  strings: number[];
}): Point[][] {
  const positions = [];
  for (let string = 1; string <= stringCount; string++) {
    const currentString = [];
    for (let fret = 0; fret <= fretCount; fret++) {
      currentString.push(getDotCoords({ fret, string, frets, strings }))
    }
    positions.push(currentString);
  }
  return positions;
}

function validateOptions(options: Options): void {
  const { stringCount, tuning } = options;
  if (stringCount !== tuning.length) {
    throw new Error(`stringCount (${stringCount}) and tuning size (${tuning.length}) do not match`);
  }
}

export class Fretboard {
  strings: number[];
  frets: number[];
  positions: Point[][];
  svg: Selection<BaseType, unknown, HTMLElement, unknown>;
  wrapper: Selection<BaseType, unknown, HTMLElement, unknown>;
  private options: Options;
  private baseRendered: boolean;
  private hoverDiv: HTMLDivElement;
  private handlers: Record<string, (event: MouseEvent) => void> = {};
  private system: FretboardSystem;
  private dots: Position[] = [];
  constructor (options = {}) {
    this.options = Object.assign({}, defaultOptions, options);
    validateOptions(this.options);    
    const {
      el,
      height,
      width,
      leftPadding,
      topPadding,
      stringCount,
      stringWidth,
      fretCount,
      scaleFrets,
      tuning
    } = this.options;

    this.strings = generateStrings({ stringCount, height, stringWidth });
    this.frets = generateFrets({ fretCount, scaleFrets });
    const { totalWidth, totalHeight } = getDimensions(this.options);

    this.system = new FretboardSystem({
      fretCount,
      tuning
    });

    this.positions = generatePositions({
      ...this,
      ...this.options
    });

    this.svg = (
      typeof el === 'string'
        ? select(el)
        : select<BaseType, unknown>(el)
      )
      .append('div')
        .attr('class', 'fretbard-html-wrapper')
        .attr('style', 'position: relative')
      .append('svg')
        .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`);

    this.wrapper = this.svg
      .append('g')
        .attr('class', 'fretboard-wrapper')
        .attr(
          'transform',
          `translate(${leftPadding}, ${topPadding}) scale(${width / totalWidth})`
        );
  }

  render(): Fretboard {
    const {
      wrapper,
      positions,
      dots
    } = this;

    const {
      font,
      dotStrokeColor,
      dotStrokeWidth,
      dotFill,
      dotSize,
      dotText,
      dotTextSize,
      disabledOpacity
    } = this.options;

    const dotOffset = this.getDotOffset();
    this.baseRender(dotOffset);

    wrapper.select('.dots').remove();

    if (!dots.length) {
      return this;
    }

    const dotGroup = wrapper
      .append('g')
        .attr('class', 'dots')
        .attr('font-family', font);

    const dotsNodes = dotGroup.selectAll('g')
      .data(dots)
      .enter()
      .filter(({ fret }) => fret >= 0)
      .append('g')
        .attr('class', dot => ['dot', dotClasses(dot, '')].join(' '))
        .attr('opacity', ({ disabled }) => disabled ? disabledOpacity : 1);

    dotsNodes.append('circle')
      .attr('class', 'dot-circle')
      .attr('cx', ({ string, fret }) => `${positions[string - 1][fret - dotOffset].x}%`)
      .attr('cy', ({ string, fret }) => positions[string - 1][fret - dotOffset].y)
      .attr('r', dotSize * 0.5)
      .attr('stroke', dotStrokeColor)
      .attr('stroke-width', dotStrokeWidth)
      .attr('fill', dotFill);

    dotsNodes.append('text')
      .attr('class', 'dot-text')
      .attr('x', ({ string, fret }) => `${positions[string - 1][fret - dotOffset].x}%`)
      .attr('y', ({ string, fret }) => positions[string - 1][fret - dotOffset].y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', dotTextSize)
      .text(dotText);

    return this;
  }

  setDots(dots: Position[]): Fretboard {
    this.dots = dots;
    return this;
  }

  clear(): Fretboard {
    this.setDots([]);
    this.wrapper.select('.dots').remove();
    return this;
  }

  style ({
    filter = (): boolean => true,
    text,
    fontSize,
    fontFill,
    ...opts
  }: {
    filter?: ValueFn<BaseType, unknown, boolean> | Rec;
    text?: ValueFn<BaseType, unknown, string>;
    fontSize?: number;
    fontFill?: string;
    [key: string]: string | number | Function | Rec;
  }): Fretboard {
    const { wrapper } = this;
    const { dotTextSize } = this.options;
    const filterFunction = filter instanceof Function
      ? filter
      : (dot: Position): boolean => {
        const [key, value] = Object.entries(filter)[0];
        return dot[key] === value;
      };

    const dots = wrapper.selectAll('.dot-circle')
      .filter(filterFunction);
    
    Object.keys(opts).forEach(
      key => dots.attr(key, (opts as Rec)[key])
    );

    if (text) {
      wrapper.selectAll('.dot-text')
        .filter(filterFunction)
        .text(text)
        .attr('font-size', fontSize || dotTextSize)
        .attr('fill', fontFill || DEFAULT_COLORS.dotText);
    }

    return this;
  }

  muteStrings(params: MuteStringsParams): Fretboard {
    const {
      wrapper,
      positions
    } = this;

    const {
      strings,
      stroke,
      strokeWidth,
      width
    } = { ...defaultMuteStringsParams, ...params };

    wrapper
      .append('g')
        .attr('class', 'muted-strings')
        .attr('transform', `translate(${-width / 2}, ${-width / 2})`)
      .selectAll('path')
        .data(strings)
        .enter()
      .append('path')
        .attr('d', d => {
          const { y } = positions[d - 1][0];
          return [
            `M 0 ${y}`,
            `L ${width} ${y + width}`,
            `M ${width} ${y}`,
            `L 0 ${y + width}`
          ].join(' ');
        })
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth)
        .attr('class', 'muted-string');

    return this;
  }

  renderChord(chord: string, barres?: Barre | Barre[]): Fretboard {
    const { positions, mutedStrings: strings } = parseChord(chord);
    this.setDots(positions);
    if (barres) {
      this.renderBarres([].concat(barres));
    }    
    this.render();
    this.muteStrings({ strings });
    return this;
  }

  renderScale({
    type,
    root,
    box
  }: {
    type: string;
    root: string;
    box?: {
      system: Systems;
      box: string|number;
    };
  }): Fretboard {
    if (box && this.options.tuning.toString() !== GUITAR_TUNINGS.default.toString()) {
      console.warn('Selected scale system works for standard tuning. Wrong notes may be highlighted.');
    }
    const dots = this.system.getScale({ type, root, box });
    return this.setDots(dots).render();
  }

  renderBox({
    type,
    root,
    box
  }: {
    type: string;
    root: string;
    box?: {
      system: Systems;
      box: string | number;
    };
  }): Fretboard {
    if (this.options.tuning.toString() !== GUITAR_TUNINGS.default.toString()) {
      console.warn('Selected scale system works for standard tuning. Wrong notes may be highlighted.');
    }

    const dots = this.system.getScale({ type, root, box }).filter(({ inBox }) => inBox);
    return this.setDots(dots).render();
  }  

  on(eventName: string, handler: FretboardHandler): Fretboard {
    const {
      svg,
      options,
      strings,
      frets,
      hoverDiv
    } = this;
    const stringsGroup = svg.select('.strings');

    if (!hoverDiv) {
      this.hoverDiv = createHoverDiv(options);
      (svg.node() as HTMLElement).parentNode.appendChild(this.hoverDiv);
    }

    if (this.handlers[eventName]) {
      this.hoverDiv.removeEventListener(eventName, this.handlers[eventName]);
    } else {
      this.handlers[eventName] = throttle(
        THROTTLE_INTERVAL,
        (event: MouseEvent) => handler(getPositionFromMouseCoords({
          event,
          stringsGroup,
          strings,
          frets,
          ...options
        }
      )));
      this.hoverDiv.addEventListener(eventName, this.handlers[eventName]);
    }
    return this;
  }

  removeEventListeners(): Fretboard {
    const {
      hoverDiv,
      handlers
    } = this;
    if (!hoverDiv) {
      return this;
    }
    Object
      .entries(handlers)
      .map(
        ([eventName, handler]) => hoverDiv.removeEventListener(eventName, handler)
      );
    return this;
  }

  private renderBarres(barres: Barre[]): void {
    const {
      wrapper,
      strings,
      options,
      positions
    } = this;

    const normalisedBarres = barres.map(({
      fret,
      stringFrom,
      stringTo
    }: Barre) => ({
      fret,
      stringFrom: stringFrom
        ? Math.min(stringFrom, strings.length)
        : strings.length,
      stringTo: stringTo
        ? Math.max(stringTo, 1)
        : 1
    }));

    const { dotSize, barresColor } = options;
    const dotOffset = this.getDotOffset();
    const barreWidth = dotSize * .8;
    
    const barresGroup = wrapper
      .append('g')
      .attr('class', 'barres')
      .attr('transform', `translate(-${barreWidth * .5}, 0)`);

    barresGroup
      .selectAll('rect')
      .data(normalisedBarres)
      .enter()
      .append('rect')
      .attr('y', ({ fret, stringTo }: Barre) => positions[stringTo - 1][fret - dotOffset].y - dotSize * .75)
      .attr('x', ({ fret, stringFrom }: Barre) => `${positions[stringFrom - 1][fret - dotOffset].x}%`)
      .attr('rx', 7.5)
      .attr('width', barreWidth)
      .attr('height', ({ stringFrom, stringTo }: Barre) => strings[stringFrom - 1] - strings[stringTo - 1] + 1.5 * dotSize)
      .attr('fill', barresColor);
  }

  private baseRender(dotOffset: number): void {
    if (this.baseRendered) {
      return;
    }

    const {
      wrapper,
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

    const stringGroup = wrapper
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
      .attr('stroke-width', (_d, i) => getStringThickness({ stringWidth, stringIndex: i }));

    const fretsGroup = wrapper
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
        switch (i) {
          case 0:
            return nutColor;
          case MIDDLE_FRET + 1:
            return middleFretColor;
          default:
            return fretColor;
        }
      })
      .attr('stroke-width', (_d, i) => {
        switch (i) {
          case 0:
            return nutWidth;
          case MIDDLE_FRET + 1:
            return middleFretWidth;
          default:
            return fretWidth;
        }
      });

    if (showFretNumbers) {
      const fretNumbersGroup = wrapper
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

  private getDotOffset(): number {
    const { dots } = this;
    const { crop, fretLeftPadding } = this.options;
    return crop
      ? Math.max(0, Math.min(...dots.map(({ fret }) => fret)) - 1 - fretLeftPadding)
      : 0;    
  }
}
