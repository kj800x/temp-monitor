import fs from "fs";
import {
  groomLongStates,
  groomShortStates,
  groomStates,
  ONE_DAY_IN_MS,
  ONE_MINUTE_IN_MS,
} from "./groom";
import { Queue } from "./queue";

let firstDataPointTime = null;

export const getFirstDataPointTime = () => firstDataPointTime;

export const prepareReplayData = (date) => {
  if (fs.existsSync("./logs/current.csv")) {
    const states = fs
      .readFileSync("./logs/current.csv", "utf-8")
      .split("\n")
      .filter(Boolean)
      .map((line) => ({
        time: parseInt(line.split(",")[0], 10),
        temperature: parseFloat(line.split(",")[1]),
      }));

    const replayData = groomStates(
      ONE_DAY_IN_MS,
      ONE_MINUTE_IN_MS,
      date
    )(new Queue(), states).toArray();

    return replayData;
  } else {
    return [];
  }
};

export const hydrate = () => {
  if (fs.existsSync("./logs/current.csv")) {
    const states = fs
      .readFileSync("./logs/current.csv", "utf-8")
      .split("\n")
      .filter(Boolean)
      .map((line) => ({
        time: parseInt(line.split(",")[0], 10),
        temperature: parseFloat(line.split(",")[1]),
      }));

    firstDataPointTime =
      states.length > 0 ? states[0].time : new Date().getTime();

    return {
      shortHistoricalStates: groomShortStates(new Queue(), states),
      longHistoricalStates: groomLongStates(new Queue(), states),
    };
  } else {
    return {
      shortHistoricalStates: new Queue(),
      longHistoricalStates: new Queue(),
    };
  }
};
