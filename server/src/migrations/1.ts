import path from "path";
import betterSqlite3 from "better-sqlite3";
import mkdirp from "mkdirp";
import fs from "fs";
import { VERBOSE_DB } from "../env/verboseDb";

import type { Migration } from "../data-migrator";
import loglevel from "loglevel";

export const migration: Migration = (dataDir) => {
  mkdirp.sync(path.resolve(dataDir));

  // Create the DB
  const db = betterSqlite3(path.resolve(dataDir, "db.db"), {
    verbose: VERBOSE_DB ? loglevel.getLogger("db-migrator").debug : undefined,
  });
  const sql = fs.readFileSync(path.resolve(__dirname, "1.sql"), "utf8");

  db.exec(sql);
};
