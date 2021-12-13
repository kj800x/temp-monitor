import log from "loglevel";
import { MutationFunction } from "./types";

function withSafeError<T, S>(
  func: MutationFunction<T, S>,
  errorReturnFn = (e: Error) => ({ error: e })
): MutationFunction<T, S> {
  return async (...args) => {
    try {
      return await func(...args);
    } catch (e) {
      log.error((e as Error).stack);
      return errorReturnFn(e as Error);
    }
  };
}

export default withSafeError;
