export function get<O, K extends keyof O>(k: K) {
  return function (o: O): O[K] {
    return o[k];
  };
}
