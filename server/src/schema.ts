import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import DataLoader from "dataloader";
import { mapValues } from "./util/mapValues";
import type { DataLoaders, DomainObject } from "./domain-objects/types";
import { typeDefs } from "./typeDefs";
import jwt from "jsonwebtoken";

import GraphQLJSON from "graphql-type-json";
import GraphQLDate from "./customScalars/Date";
import GraphQLBlob from "./customScalars/Blob";
import { Datapoint } from "./domain-objects/Datapoint";
import { Query } from "./resolvers/Query";
import { Subscription } from "./resolvers/Subscription";
import { Mutation } from "./resolvers/Mutation";
import { JWT_KEY } from "./env/jwtKey";

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

export type JWT_RESULT =
  | { status: "authenticated"; payload: any }
  | { status: "unauthenticated" };

function checkToken(token: string): JWT_RESULT {
  try {
    const payload = jwt.verify(token, JWT_KEY);
    return { status: "authenticated", payload };
  } catch (err) {
    return { status: "unauthenticated" };
  }
}

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";

    return {
      loaders: buildDataLoaders(),
      auth: checkToken(token),
    };
  },
  uploads: false,
  subscriptions: "/temp/graphql",
  playground: {
    endpoint: "/temp/graphql",
    subscriptionEndpoint: "/temp/graphql",
    settings: {
      "editor.theme": "dark",
    },
  },
});

export const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
