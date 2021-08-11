import { broadcast } from "./websocket";
import { log } from "./logger";

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

let temperature = 0;
let historicalStates = [];

export const getHistoricalStates = () => {
  return historicalStates;
};

export const recordTemperature = (value) => {
  temperature = value;
  updateState();
};

function updateState() {
  const threshold = new Date().getTime() - ONE_DAY_IN_MS;
  const state = { time: new Date().getTime(), temperature };
  historicalStates = [
    ...historicalStates.filter((state) => state.time > threshold),
    state,
  ];

  broadcast({ state });
  log(state);
}
