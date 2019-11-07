export function disableStrings({
  dots = [],
  strings = []
}) {
  return dots.map(({ string, ...dot }) => {
    return { string, disabled: strings.indexOf(string) > -1, ...dot};
  });
}
