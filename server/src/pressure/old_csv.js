import fs from "fs";
import process from "process";
import neatCsv from "neat-csv";

console.log("using old_csv pressure method");

let startTime = new Date().getTime();
let data = [];

if (!process.env.PRESSURE_FILE) {
  console.error("err: must specify PRESSURE_FILE env variable");
  process.exit(1);
}

const csv = fs.readFileSync(process.env.PRESSURE_FILE);

neatCsv(csv, {
  headers: ["timestamp", "raw", "psi"],
  mapValues: ({ value }) => parseFloat(value),
}).then((parsedRawData) => {
  const firstTimestamp = parsedRawData[0].timestamp;
  data = parsedRawData.map(({ timestamp, raw, psi }) => ({
    timestamp: timestamp - firstTimestamp,
    raw,
    psi,
  }));
});

export const getPressure = () => {
  const elapsed = new Date().getTime() - startTime;
  if (!data) {
    return 0;
  }
  return data.find((row) => row.timestamp > elapsed).psi || data[0].psi;
};
