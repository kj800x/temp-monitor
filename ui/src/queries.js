import gql from "graphql-tag";

export const FETCH_APP_STATE = gql`
  query appState {
    appState {
      id
      logging
    }
  }
`;

export const SET_LOGGING = gql`
  mutation setLogging($logging: Boolean!) {
    setLogging(logging: $logging) {
      id
      logging
    }
  }
`;

export const LIVE_UPDATE_SUBSCRIPTION = gql`
  subscription stateUpdate {
    stateUpdate {
      data
    }
  }
`;

export const FETCH_FIRST_DATE_AVAILABLE = gql`
  query firstDateAvailable {
    firstDateAvailable
  }
`;

export const FETCH_REPLAY_DATA = gql`
  query replayData($date: Date!) {
    replayData(date: $date) {
      data
    }
  }
`;

export const FETCH_CURRENT_HISTORICAL_DATA = gql`
  query fetchCurrentHistoricalData {
    currentHistoricalData {
      shortHistoricalStates {
        data
      }
      longHistoricalStates {
        data
      }
    }
  }
`;
