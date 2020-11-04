import { getPressure } from "./pressure";
import { broadcast } from "./websocket";
import { log } from "./logger";
import { setMotor } from "./motor";

let target = 0;
let limit = 0;
let historicalStates = [];
let state = {};
let lastJump = 0;

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
export const deriveStatus = (historicalStates, pressure) => {
  const jumpStatus = historicalStates
    .slice()
    .reverse()
    .find((state) => state.time < new Date().getTime() - 1500);
  if (jumpStatus && Math.abs(pressure - jumpStatus.pressure) > 1) {
    lastJump = new Date().getTime();
  }

  const threshold = new Date().getTime() - 15000;

  const lastStatus =
    historicalStates.length > 0
      ? historicalStates[historicalStates.length - 1].status
      : 0;

  const pressures = historicalStates
    .filter((state) => state.time > threshold && state.time > lastJump)
    .map((s) => s.pressure);
  const avgPressure = avg(pressures);
  if (pressure > avgPressure + 0.05) {
    return { status: lastStatus + 0.003, avg: avgPressure };
  }
  return { status: lastStatus - (1.2 - lastStatus) * 0.0011, avg: avgPressure };
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
  const { status, avg } = deriveStatus(historicalStates, pressure);
  const motor = deriveMotor(status, target, limit);
  return {
    time: new Date().getTime(),
    pressure: pressure,
    avg,
    status: Math.max(0, Math.min(status, 1)),
    motor: Math.max(0, Math.min(motor, 1)),
    target: Math.max(0, Math.min(target, 1)),
    limit: Math.max(0, Math.min(limit, 1)),
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
  setMotor(getState().motor);
  log(getState());
}

setInterval(updateState, 50);
