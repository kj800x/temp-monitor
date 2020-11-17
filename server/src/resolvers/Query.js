import fs from 'fs';

export const Query = {
  resolver: {
    allReplayDataOptions: () => {
      if (fs.existsSync("./logs")) {
        return fs.readdirSync("./logs")
      } else {
        return [];
      }
    },

    replayData: (_, { file }) => {
      return [];
    },

    appState: () => 1,
  },
};
