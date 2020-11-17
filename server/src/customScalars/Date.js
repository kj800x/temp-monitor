import { GraphQLScalarType } from "graphql";

export default new GraphQLScalarType({
  name: "Date",
  description: "Date as represented by getTime",
  parseValue(value) {
    return value;
    // if (value !== null) {
    //   return new Date(value); // value from the client
    // }
    // return null;
  },
  serialize(value) {
    return value;
    // if (value !== null) {
    //   value.getTime();
    // }
    // return null; // value sent to the client
  },
  parseLiteral(ast) {
    return value;
    // if (ast.kind === Kind.INT) {
    //   return new Date(+ast.value); // ast value is always in string format
    // }
    // return null;
  },
});
