import fs from "fs";
import { groomLongStates, groomShortStates } from "./groom";

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

    return {
      shortHistoricalStates: groomShortStates(states),
      longHistoricalStates: groomLongStates(states),
    };
  } else {
    return { shortHistoricalStates: [], longHistoricalStates: [] };
  }
};
