import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar JSON
  scalar Date

  type Datum {
    data: JSON!
  }

  type AppState {
    id: Int!
    logging: Boolean!
  }

  type HistoricalData {
    shortHistoricalStates: [Datum!]!
    longHistoricalStates: [Datum!]!
  }

  type Query {
    firstDateAvailable: Date!
    replayData(date: Date!): [Datum!]!
    appState: AppState!
    currentHistoricalData: HistoricalData!
  }

  type Mutation {
    setLogging(logging: Boolean!): AppState!
  }

  type Subscription {
    stateUpdate: Datum!
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
