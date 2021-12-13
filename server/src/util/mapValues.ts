export function mapValues<T, K>(
  object: { [key: string]: T },
  mapper: (t: T) => K
) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, mapper(value)])
  );
}
