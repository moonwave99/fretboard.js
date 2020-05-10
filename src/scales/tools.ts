import { Dot } from './scales';

export function disableStrings({
  box = [],
  strings = []
}: {
  box: Dot[];
  strings: number[];
}) {
  return box.map(({ string, ...dot }) => {
    return { string, disabled: strings.indexOf(string) > -1, ...dot};
  });
}

export function sliceBox({
  box = [] as Dot[],
  from = { string: 6, fret: 0 },
  to = { string: 1, fret: 100 }
} = {}) {
  function findIndex(key: {
    string: number;
    fret: number;
  }) {
    return box.findIndex(({ string, fret }) =>
      string === key.string && fret === key.fret
    );
  }
  let fromIndex = findIndex(from);
  if (fromIndex === -1) {
    fromIndex = 0;
  }
  let toIndex = findIndex(to);
  if (toIndex === -1) {
    toIndex = box.length;
  }
  return box.slice(fromIndex, toIndex);
}

export function disableDots({
  box = [] as Dot[],
  from = { string: 6, fret: 0 },
  to = { string: 1, fret: 100 }
} = {}) {
  const action = (dot: Dot) => {
    return { disabled: true, ...dot };
  };
  return transform({ box, from, to, action });
}

function transform({
  box = [],
  from = { string: 6, fret: 0 },
  to = { string: 1, fret: 100 },
  action = (x: Dot): Dot => x
} = {}) {
  function inSelection({ string, fret }: {
    string: number;
    fret: number;
  }) {
    if (string > from.string || string < to.string) {
      return false;
    }
    if (string === from.string && fret < from.fret) {
      return false;
    }
    if (string === to.string && fret > to.fret) {
      return false;
    }
    return true;
  }
  return box.map(x => inSelection(x) ? action(x) : x);
}