// https://stackoverflow.com/a/41956372/1556343
export function binarySearch<T>(
  array: T[],
  pred: (elem: T) => -1 | 0 | 1
): T | undefined {
  const idx = binarySearchIndex(array, pred);
  if (idx === -1) {
    return undefined;
  }
  return array[idx];
}

function binarySearchIndex<T>(
  array: T[],
  pred: (elem: T) => -1 | 0 | 1
): number {
  var m = 0;
  var n = array.length - 1;
  while (m <= n) {
    var k = (n + m) >> 1;
    var cmp = pred(array[k]);
    if (cmp > 0) {
      m = k + 1;
    } else if (cmp < 0) {
      n = k - 1;
    } else {
      return k;
    }
  }
  return -m - 1;
}
