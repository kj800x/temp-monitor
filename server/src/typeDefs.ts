import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar JSON
  scalar Date
  scalar Blob

  type Datapoint {
    id: Int!
    temperature: Float!
    date: Date!
  }

  type Query {
    data: [Datapoint!]!
  }

  type Mutation {
    record(temperature: Float, date: Date!): Datapoint
  }

  type Subscription {
    liveTemperature: Datapoint
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
