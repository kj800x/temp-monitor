import fs from "fs";
import path from "path";
import { DATA_DIR } from "./dataDir";
import crypto from "crypto";

import loglevel from "loglevel";
const log = loglevel.getLogger("jwt");

const KEY_PATH = path.join(DATA_DIR, "jwt-key.bin");

export let JWT_KEY: Buffer;

if (fs.existsSync(KEY_PATH)) {
  JWT_KEY = fs.readFileSync(KEY_PATH);
} else {
  log.info("Generating a new JWT_KEY");
  JWT_KEY = crypto.randomBytes(64);
  fs.writeFileSync(KEY_PATH, JWT_KEY);
}
