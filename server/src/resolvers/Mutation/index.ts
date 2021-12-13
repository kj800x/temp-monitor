import { record } from "./record";

import withSafeError from "./withSafeError";
import { MutationFunction } from "./types";

function allWithFn<T>(fn: (arg1: T) => T) {
  return function (obj: { [key: string]: T }): { [key: string]: T } {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
  };
}

export const Mutation = {
  resolver: allWithFn<MutationFunction<any, any>>(withSafeError)({
    record,
  }),
};
