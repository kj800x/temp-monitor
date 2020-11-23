import { getPressure } from "./pressure";
import { broadcast } from "./websocket";
import { log } from "./logger";
import { setMotor } from "./motor";
import { pipeline } from "./pipeline";

let target = 0;
let limit = 0;
let historicalStates = [];
let state = {};

export const setTarget = (value) => {
  target = value;
};
export const setLimit = (value) => {
  limit = value;
};

export const getState = () => {
  return state;
};

function deriveNextState() {
  const pressure = getPressure();

  const datum = {
    time: new Date().getTime(),
    pressure: pressure,
    target,
    limit,
  };

  return pipeline.reduce(
    (datum, fn) => ({
      ...datum,
      ...fn(datum, historicalStates),
    }),
    datum
  );
}

function updateState() {
  state = deriveNextState();
  const threshold = new Date().getTime() - 60000;
  historicalStates = [
    ...historicalStates.filter((state) => state.time > threshold),
    state,
  ];

  // callbacks
  broadcast({ state: getState() });
  setMotor(getState().motor);
  log(getState());
}

setInterval(updateState, 50);
