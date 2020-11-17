import process from "process";

export let getPressure;

switch (process.env.PRESSURE_SOURCE) {
  case "OLD_CSV": {
    getPressure = require("./old_csv.js").getPressure;
    break;
  }
  case "CSV": {
    getPressure = require("./csv.js").getPressure;
    break;
  }
  case "RANDOM": {
    getPressure = require("./random.js").getPressure;
    break;
  }
  case "REAL": {
    getPressure = require("./real.js").getPressure;
    break;
  }
  default: {
    console.log("info: pressure not enabled");
    getPressure = () => 0;
  }
}
