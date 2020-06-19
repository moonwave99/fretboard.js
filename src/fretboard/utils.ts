import { Selection, BaseType } from 'd3-selection';
import { Position, Options } from './Fretboard';

export function generateStrings({
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

export function generateFrets({
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

export function dotClasses(dot: Position, prefix: string): string {
  return [
    `dot-${prefix}`,
      ...Object.entries(dot)
        .map(([key, value]: [string, string]) => `dot-${prefix}-${key}-${value}`)
  ].join(' ');
}

export function getDimensions({
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

type GetPositionParams = {
  event: MouseEvent;
  stringsGroup: Selection<BaseType, unknown, HTMLElement, unknown>;
  leftPadding: number;
  nutWidth: number;
  strings: number[];
  frets: number[];
}

export const getPositionFromMouseCoords = ({
  event,
  stringsGroup,
  leftPadding,
  nutWidth,
  strings,
  frets
}: GetPositionParams): Position => {
  const {
    width: stringsGroupWidth,
    height: stringsGroupHeight
  } = (stringsGroup.node() as HTMLElement).getBoundingClientRect();
  const bounds = (event.target as HTMLElement).getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;

  let foundString = 0;

  const stringDistance = stringsGroupHeight / (strings.length - 1);

  for (let i = 0; i < strings.length; i++) {
     if (y < stringDistance * (i + 1)) {
       foundString = i;
       break;
     }
  }

  let foundFret = -1;
  const percentX = (Math.max(0, x - leftPadding) / stringsGroupWidth) * 100;

  for (let i = 0; i < frets.length; i++) {
    if (percentX < frets[i]) {
      foundFret = i;
      break;
    }
  }

  if (x < leftPadding + nutWidth) {
    foundFret = 0;
  }

  return {
    string: foundString + 1,
    fret: foundFret
  }
}

export function createHoverDiv({
  bottomPadding,
  showFretNumbers,
  fretNumbersHeight
}: Options): HTMLDivElement {
  const hoverDiv = document.createElement('div');
  const bottom = bottomPadding
    + (showFretNumbers ? fretNumbersHeight : 0);
  hoverDiv.className = 'hoverDiv';
  hoverDiv.style.position = 'absolute';
  hoverDiv.style.top = '0';
  hoverDiv.style.bottom = `${bottom}px`;
  hoverDiv.style.left = '0';
  hoverDiv.style.right = '0';
  return hoverDiv;
}
