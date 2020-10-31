import process from "process";
import fs from "fs";
import neatCsv from "neat-csv";

export let getPressure;

if (process.env.PRESSURE_SOURCE === "OLD_CSV") {
  let startTime = new Date().getTime();
  let data = [];

  const csv = fs.readFileSync("./pressure_readings.csv");

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

  getPressure = () => {
    const elapsed = new Date().getTime() - startTime;
    if (!data) {
      return 0;
    }
    return data.find((row) => row.timestamp > elapsed).psi || data[0].psi;
  };
} else if (process.env.PRESSURE_SOURCE === "RANDOM") {
  getPressure = () => {
    return Math.log(5 * Math.random() + 1) * 0.5 * 7 + 14;
  };
} else {
  console.warn("GET PRESSURE REAL NOT IMPLEMENTED");
  getPressure = () => {
    return Math.random();
  };
}
