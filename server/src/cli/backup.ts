import mkdirp from "mkdirp";
import path from "path";
import { DATA_DIR } from "../env/dataDir";
import loglevel from "loglevel";
import { db } from "../db";
import tar from "tar";
import fs from "fs-extra";

const log = loglevel.getLogger("db-backup");

export async function backup(name?: string) {
  const date = new Date();
  const nowString = date
    .toISOString()
    .replace(/T/g, "--")
    .replace(/:/g, "-")
    .replace(/\./g, "--")
    .replace(/Z/g, "");
  const labelPart = name ? `--${name.replace(/[^A-Za-z0-9]/g, "_")}` : "";

  const backupDir = path.join(DATA_DIR, "backups");
  const backupFile = `${nowString}${labelPart}.db`;
  const backupFileCompressed = `${nowString}${labelPart}.db.gz`;
  const backupPath = path.join(backupDir, backupFile);
  const backupPathCompressed = path.join(backupDir, backupFileCompressed);

  mkdirp.sync(backupDir);

  log.info(`backing up database to ${backupFile}`);

  await db.backup(backupPath, {
    progress: ({ totalPages, remainingPages }) => {
      if (remainingPages !== totalPages) {
        log.info(
          `progress: ${(
            ((totalPages - remainingPages) / totalPages) *
            100
          ).toFixed(1)}%`
        );
      }

      return 100;
    },
  });

  log.info(`compressing database`);

  await tar.create(
    {
      file: backupPathCompressed,
      gzip: true,
      cwd: backupDir,
    },
    [backupFile]
  );

  await fs.unlink(backupPath);

  log.info(`backup complete`);
}
