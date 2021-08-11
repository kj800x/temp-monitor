import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar JSON

  type Datum {
    data: JSON!
  }

  type AppState {
    id: Int!
    logging: Boolean!
  }

  type Query {
    allReplayDataOptions: [String!]!
    replayData(file: String!): [Datum!]!
    appState: AppState!
    currentHistoricalData: [Datum!]!
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
