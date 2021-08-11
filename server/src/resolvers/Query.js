import fs from "fs";
import neatCsv from "neat-csv";
import { getHistoricalStates } from "../state";

const prepareReplayData = async (file) => {
  const csv = fs.readFileSync(`./logs/${file}`);
  const parsedRawData = await neatCsv(csv, {
    headers: ["timestamp", "temperature"],
    mapValues: ({ value }) => parseFloat(value),
  });
  const firstTimestamp = parsedRawData[0].timestamp;
  return parsedRawData.map(
    ({ timestamp, pressure, status, motor, target, limit }) => ({
      time: timestamp - firstTimestamp,
      pressure,
      status,
      motor,
      target,
      limit,
    })
  );
};

export const Query = {
  resolver: {
    allReplayDataOptions: () => {
      if (fs.existsSync("./logs")) {
        return fs.readdirSync("./logs");
      } else {
        return [];
      }
    },

    currentHistoricalData: async () => {
      return getHistoricalStates();
    },

    replayData: async (_, { file }) => {
      return await prepareReplayData(file);
    },

    appState: () => 1,
  },
};
