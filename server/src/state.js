import { broadcast } from "./websocket";
import { log } from "./logger";
import { hydrate } from "./hydrate";
import { groomLongStates, groomShortStates } from "./groom";

console.log("hydrate start");
let { shortHistoricalStates, longHistoricalStates } = hydrate();
console.log("hydrate complete");

export const getHistoricalStates = () => {
  return { shortHistoricalStates, longHistoricalStates };
};

export const recordTemperature = (temperature) => {
  const state = { time: new Date().getTime(), temperature };
  shortHistoricalStates = [...groomShortStates(shortHistoricalStates), state];
  longHistoricalStates = [...groomLongStates(longHistoricalStates), state];

  broadcast({ state });
  log(state);
};
