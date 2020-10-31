import stringify from "csv-stringify";
import fs from "fs";

const now = new Date();
const nowString = `${now.getFullYear()}-${
  now.getMonth() + 1
}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;

const output = fs.createWriteStream(`./logs/${nowString}.csv`);
const csvStringStream = stringify();
csvStringStream.on("error", function (err) {
  console.error(err.message);
});
csvStringStream.pipe(output);

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

/*
time: new Date().getTime(),
pressure,
status,
motor,
target,
limit,
*/
