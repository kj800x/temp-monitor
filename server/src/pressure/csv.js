import fs from "fs";
import process from "process";
import neatCsv from "neat-csv";

console.log("using csv pressure method");

const TIME_OFFSET = process.env.TIME_OFFSET || 0;
let startTime = new Date().getTime() - TIME_OFFSET * 1000;
let data = [];

if (!process.env.PRESSURE_FILE) {
  console.error("err: must specify PRESSURE_FILE env variable");
  process.exit(1);
}

const csv = fs.readFileSync(process.env.PRESSURE_FILE);

neatCsv(csv, {
  headers: ["timestamp", "pressure", "status", "motor", "target", "limit"],
  mapValues: ({ value }) => parseFloat(value),
}).then((parsedRawData) => {
  const firstTimestamp = parsedRawData[0].timestamp;
  data = parsedRawData.map(
    ({ timestamp, pressure, status, motor, target, limit }) => ({
      timestamp: timestamp - firstTimestamp,
      pressure,
      status,
      motor,
      target,
      limit,
    })
  );
});

export const getPressure = () => {
  const elapsed = new Date().getTime() - startTime;
  if (!data) {
    return 0;
  }
  const datum = data.find((row) => row.timestamp > elapsed);
  return datum ? datum.pressure : 0;
};
