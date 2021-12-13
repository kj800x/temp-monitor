import { Context } from "../../domain-objects/types";

export type MutationFunction<Args, T> = (
  parent: any,
  args: Args,
  context: Context
) => { error: Error } | T | Promise<{ error: Error } | T>;
