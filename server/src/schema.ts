import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import DataLoader from "dataloader";
import { mapValues } from "./util/mapValues";
import type { DataLoaders, DomainObject } from "./domain-objects/types";
import { typeDefs } from "./typeDefs";

import GraphQLJSON from "graphql-type-json";
import GraphQLDate from "./customScalars/Date";
import GraphQLBlob from "./customScalars/Blob";
import { Datapoint } from "./domain-objects/Datapoint";
import { Query } from "./resolvers/Query";
import { Subscription } from "./resolvers/Subscription";
import { Mutation } from "./resolvers/Mutation";

type DomainObjects = {
  [key: string]: DomainObject<any, any>;
};

export const DOMAIN_OBJECTS: DomainObjects = {
  Datapoint,
};

export function buildDataLoaders(): DataLoaders {
  return {
    ...mapValues(DOMAIN_OBJECTS, (object) => new DataLoader(object.loader)),
  } as DataLoaders;
}

const resolvers = {
  JSON: GraphQLJSON,
  Date: GraphQLDate,
  Blob: GraphQLBlob,

  ...mapValues(DOMAIN_OBJECTS, (object) => object.resolver),

  Query: Query.resolver,
  Mutation: Mutation.resolver,
  Subscription: Subscription.resolver,
};

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    loaders: buildDataLoaders(),
  }),
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
