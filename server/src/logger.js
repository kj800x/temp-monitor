import stringify from "csv-stringify";
import fs from "fs";
import mkdirp from "mkdirp";

let logging = false;
let csvStringStream;
let output;

mkdirp.sync("./logs");

const alwaysOutput = fs.createWriteStream(`./logs/current.csv`, {
  flags: "a",
});
const alwaysOutputCsvStringStream = stringify();
alwaysOutputCsvStringStream.on("error", function (err) {
  console.error(err.message);
});
alwaysOutputCsvStringStream.pipe(alwaysOutput);

export const setLogging = (shouldBeLogging) => {
  if (shouldBeLogging && !logging) {
    logging = true;
    // mkdirp("./logs").then(() => {
    const now = new Date();
    const nowString = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;

    output = fs.createWriteStream(`./logs/${nowString}.csv`);

    csvStringStream = stringify();
    csvStringStream.on("error", function (err) {
      console.error(err.message);
    });
    csvStringStream.pipe(output);
    // });
  } else if (logging && !shouldBeLogging) {
    output.close();
    logging = false;
    csvStringStream = undefined;
  }
};

export const getLogging = () => {
  return logging;
};

export const log = (state) => {
  if (alwaysOutputCsvStringStream) {
    alwaysOutputCsvStringStream.write([state.time, state.temperature]);
  }
  if (logging && csvStringStream) {
    csvStringStream.write([state.time, state.temperature]);
  }
};
