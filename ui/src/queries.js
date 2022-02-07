import gql from "graphql-tag";

export const RECENT_DATA = gql`
  query recentData {
    data {
      id
      date
      temperature
      humidity
    }
  }
`;

export const LIVE_TEMPERATURE = gql`
  subscription liveTemperature {
    liveTemperature {
      id
      date
      temperature
      humidity
    }
  }
`;

export const REFERENCE_DATA = gql`
  query referenceData($date: Date!) {
    historicalData(date: $date) {
      id
      date
      temperature
      humidity
    }
  }
`;
