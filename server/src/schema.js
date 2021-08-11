import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";

import GraphQLJSON from "graphql-type-json";
import { typeDefs } from "./typeDefs";
import { Query } from "./resolvers/Query";
import { Datum } from "./resolvers/Datum";
import { AppState } from "./resolvers/AppState";
import { Mutation } from "./resolvers/Mutation";
import { Subscription } from "./resolvers/Subscription";

const resolvers = {
  JSON: GraphQLJSON,

  Datum: Datum.resolver,
  AppState: AppState.resolver,

  Query: Query.resolver,
  Mutation: Mutation.resolver,
  Subscription: Subscription.resolver,
};

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: false,
  subscriptions: "/temp/graphql",
  playground: {
    endpoint: "/temp/graphql",
    subscriptionEndpoint: "ws://localhost/temp/graphql",
    settings: {
      "editor.theme": "dark",
    },
  },
});

export const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
