import fs from "fs";
import path from "path";
import process from "process";
import log from "loglevel";

const { env } = process;

if (
  !env["DATA_DIR"] &&
  env["BASE_DATA_DIR"] &&
  !fs.existsSync(env["BASE_DATA_DIR"])
) {
  log.warn(
    `⚠️ BASE_DATA_DIR is set but does not exist. Falling back to default DATA_DIR.`
  );
}

export const DATA_DIR = path.resolve(
  env["DATA_DIR"] ||
    (env["BASE_DATA_DIR"] && fs.existsSync(env["BASE_DATA_DIR"])
      ? path.join(env["BASE_DATA_DIR"], "temp-monitor")
      : false) ||
    path.join(__dirname, "..", "..", "..", "data")
);
