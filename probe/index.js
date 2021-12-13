const fs = require("fs");
const { exec } = require("child_process");
const WebSocket = require("ws");

let API_HOST = process.env["API_HOST"] || "10.60.1.2";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let file;
let writeStream = fs.createWriteStream("./log.csv");
let connection = new WebSocket(`ws://${API_HOST}/temp/api`);

const log = console["log"];

connection.onerror = () => {
  process.exit(1);
};
connection.onclose = () => {
  process.exit(1);
};

function niceExec(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

async function setup() {
  await niceExec("modprobe w1-gpio");
  await niceExec("modprobe w1-therm");
  const files = fs.readdirSync("/sys/bus/w1/devices/");
  const device = files.find((file) => file.startsWith("28"));
  file = `/sys/bus/w1/devices/${device}/w1_slave`;
}

function readTemperature() {
  const contents = fs.readFileSync(file, "utf-8");
  const number = parseInt(contents.split("t=")[1].trim(), 10);
  const c = number / 1000.0;
  const f = (c * 9.0) / 5.0 + 32.0;
  return { c, f };
}

async function main() {
  await setup();
  while (true) {
    const temperature = readTemperature();
    if (connection.readyState === 1) {
      connection.send(
        JSON.stringify({
          type: "record",
          name: "temperature",
          value: temperature,
        })
      );
    } else {
      log("Could not send to server");
    }
    await sleep(10);
  }
}

main().catch(console.error);
