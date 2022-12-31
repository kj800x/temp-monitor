import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar JSON
  scalar Date
  scalar Blob

  type Datapoint {
    source: String!
    id: Int!
    temperature: Float!
    humidity: Float
    date: Date!
  }

  type HighLowPoint {
    source: String!
    date: String!
    tempHigh: Float
    tempLow: Float
    humidityHigh: Float
    humidityLow: Float
  }

  type Query {
    data: [Datapoint!]!
    sevenDays: [Datapoint!]!
    highLows: [HighLowPoint!]!
    historicalData(date: Date!): [Datapoint!]!
  }

  type Mutation {
    record(
      source: String
      temperature: Float
      humidity: Float
      date: Date
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
