import { getPressure } from "./pressure";
import { broadcast } from "./websocket";
import { log } from "./logger";

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
const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
const differences = (arr) =>
  arr.reduce((acc, v) => [v, acc[0] ? [...acc[1], v - acc[0]] : []], [
    null,
    [],
  ])[1];

export const getState = () => {
  return state;
};
export const deriveStatus = (historicalStates) => {
  const threshold = new Date().getTime() - 5000;

  const lastStatus =
    historicalStates.length > 0
      ? historicalStates[historicalStates.length - 1].status
      : 0;

  const pressures = historicalStates
    .filter((state) => state.time > threshold)
    .map((s) => s.pressure);
  const slopes = differences(pressures);
  const avgSlope = avg(slopes);
  if (avgSlope > 0) {
    return lastStatus + avgSlope * 0.8;
  }
  return lastStatus * 0.98;
};
export const deriveMotor = (status, target, limit) => {
  if (limit === 1) {
    return target;
  }
  if (status > limit) {
    return 0;
  }
  if (status + 0.2 > limit) {
    return target * -5 * (status - limit);
  }
  return target;
};

function deriveNextState() {
  const pressure = getPressure();
  const status = deriveStatus(historicalStates, pressure);
  const motor = deriveMotor(status, target, limit);
  return {
    time: new Date().getTime(),
    pressure,
    status,
    motor,
    target,
    limit,
  };
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
  log(getState());
}

setInterval(updateState, 50);
