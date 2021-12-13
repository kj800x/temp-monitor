import { GraphQLScalarType, Kind } from "graphql";

export default new GraphQLScalarType({
  name: "Date",
  description: "Date",
  parseValue(value) {
    return new Date(value); // value from the client
  },
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime(); // value sent to the client
    }
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10); // ast value is always in string format
    }
    return null;
  },
});
