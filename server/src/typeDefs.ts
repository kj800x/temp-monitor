import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar JSON
  scalar Date
  scalar Blob

  type Datapoint {
    id: Int!
    temperature: Float!
    humidity: Float
    date: Date!
  }

  type Query {
    data: [Datapoint!]!
    historicalData(date: Date!): [Datapoint!]!
  }

  type Mutation {
    record(
      apiKey: String!
      temperature: Float
      humidity: Float
      date: Date!
    ): Datapoint
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
