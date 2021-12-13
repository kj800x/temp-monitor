import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

export default new GraphQLScalarType({
  name: "Blob",
  description: "Blob buffer",
  parseValue(value: number[]) {
    return Buffer.from(value);
  },
  serialize(value) {
    if (value instanceof Buffer) {
      return [...value];
    }
    throw new TypeError(
      `Blob cannot represent a non buffer value: ${value.toString()}`
    );
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.LIST) {
      throw new Error("TODO needs implementation");
    }
    return null;
  },
});
