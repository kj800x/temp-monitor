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
        ? 0
        : 0.5,
  };
}

function generateStatus(datum, recentData) {
  return { status: 2 * average(recentData.map((d) => d.squeeze)) };
}

function limitStatus(datum, recentData) {
  return { status: datum.status > 1 ? 1 : datum.status };
}

return {
  program: [
    findLastJump,
    generateAverage,
    generateSqueeze,
    generateStatus,
    limitStatus,
  ],
  dataSpec: [{ chart: "status", key: "squeeze", color: "yellow" }],
};
