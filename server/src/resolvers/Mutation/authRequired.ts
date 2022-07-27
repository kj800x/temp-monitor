import { AuthenticationError } from "apollo-server-express";

// If only ECMAScript supported function decorators, this would be a perfect use case
export function authRequired<
  Parent,
  Args,
  Context extends { auth: any },
  Return
>(resolver: (parent: Parent, args: Args, context: Context) => Return) {
  return (parent: Parent, args: Args, context: Context) => {
    if (context.auth.status !== "authenticated") {
      throw new AuthenticationError(
        "This request requires auth and the client did not provide a valid JWT token"
      );
    }

    return resolver(parent, args, context);
  };
}
