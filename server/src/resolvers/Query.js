import { getHistoricalStates } from "../state";
import { getFirstDataPointTime, prepareReplayData } from "../hydrate";

export const Query = {
  resolver: {
    firstDateAvailable: () => {
      return new Date(getFirstDataPointTime());
    },

    currentHistoricalData: async () => {
      return getHistoricalStates();
    },

    replayData: async (_, { date }) => {
      return await prepareReplayData(date);
    },

    appState: () => 1,
  },
};
