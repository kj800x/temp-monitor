export function order<T, K extends keyof T>(
  data: T[],
  ordering: readonly T[K][],
  // @ts-expect-error not sure if there is a better way to assert that T has an id field iff this is not specified
  orderingKey: K = "id"
): Promise<T[]> {
  return Promise.resolve(
    ordering.map((id) => data.find((datum) => datum[orderingKey] === id)) as T[]
  );
}

export function groupByOrder<T extends { id: number }, K extends keyof T>(
  data: T[],
  ordering: readonly T[K][],
  orderingKey: K
): Promise<number[][]> {
  return Promise.resolve(
    ordering.map((id) =>
      data.filter((datum) => datum[orderingKey] === id).map((datum) => datum.id)
    )
  );
}
