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
    sevenDays: [Datapoint!]!
    historicalData(date: Date!): [Datapoint!]!
  }

  type Mutation {
    record(temperature: Float, humidity: Float, date: Date!): Datapoint
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
