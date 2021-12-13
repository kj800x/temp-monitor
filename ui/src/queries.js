import gql from "graphql-tag";

export const RECENT_DATA = gql`
  query recentData {
    data {
      id
      temperature
      date
    }
  }
`;

export const LIVE_TEMPERATURE = gql`
  subscription liveTemperature {
    liveTemperature {
      id
      date
      temperature
    }
  }
`;
