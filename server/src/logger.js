import stringify from "csv-stringify";
import fs from "fs";
import mkdirp from "mkdirp";

const now = new Date();
const nowString = `${now.getFullYear()}-${
  now.getMonth() + 1
}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;

const csvStringStream = stringify();
csvStringStream.on("error", function (err) {
  console.error(err.message);
});

mkdirp("./logs").then(() => {
  const output = fs.createWriteStream(`./logs/${nowString}.csv`);
  csvStringStream.pipe(output);
});

export const log = (state) => {
  csvStringStream.write([
    state.time,
    state.pressure,
    state.status,
    state.motor,
    state.target,
    state.limit,
  ]);
};
