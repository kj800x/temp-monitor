import log from "loglevel";
import { MutationFunction } from "./types";

function withSafeError<T, S>(
  func: MutationFunction<T, S>
): MutationFunction<T, S> {
  return async (...args) => {
    try {
      return await func(...args);
    } catch (e) {
      log.error((e as Error).stack);
      throw e;
    }
  };
}

export default withSafeError;
