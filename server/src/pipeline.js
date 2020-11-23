const add = (a, b) => a + b;

function average(arr) {
  return arr.reduce(add, 0) / arr.length;
}

function findLastJump(datum, recentData) {
  const lastJump = recentData
    .slice()
    .reverse()
    .find(
      (state) =>
        Math.abs(
          recentData.find((otherState) => otherState.time > state.time - 1000)
            .pressure - state.pressure
        ) > 1
    );

  return {
    lastJumpTime: lastJump ? lastJump.time : 0,
  };
}

const AVERAGE_WINDOW = 12000;

function generateAverage(datum, recentData) {
  const scanData = recentData.filter(
    (d) => d.time >= datum.lastJumpTime && d.time > datum.time - AVERAGE_WINDOW
  );

  return { avg: average(scanData.map((d) => d.pressure)) };
}

function generateSqueeze(datum, recentData) {
  return {
    squeeze:
      datum.pressure > datum.avg + 0.05
        ? 1
        : datum.pressure < datum.avg - 0.05
        ? -0.1
        : 0,
  };
}

function generateStatus(datum, recentData) {
  return { status: 1.5 * average(recentData.map((d) => d.squeeze)) };
}

export const deriveMotor = ({ status, target, limit }) => {
  if (limit === 1) {
    return { motor: target };
  }
  if (status > limit) {
    return { motor: 0 };
  }
  if (status + 0.2 > limit) {
    return { motor: target * -5 * (status - limit) };
  }
  return { motor: target };
};

function limitValues(datum, recentData) {
  return {
    status: Math.max(0, Math.min(datum.status, 1)),
    motor: Math.max(0, Math.min(datum.motor, 1)),
    target: Math.max(0, Math.min(datum.target, 1)),
    limit: Math.max(0, Math.min(datum.limit, 1)),
  };
}

export const pipeline = [
  findLastJump,
  generateAverage,
  generateSqueeze,
  generateStatus,
  deriveMotor,
  limitValues,
];

export const dataSpec = [{ chart: "status", key: "squeeze", color: "yellow" }];
