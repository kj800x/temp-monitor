import fs from "fs";
import loglevel from "loglevel";
import path from "path";

const log = loglevel.getLogger("data-migrator");

export type Migration = (dataDir: string) => void;

const MANIFEST_FILE = "manifest.json";

class BoundDataMigrator {
  dataDir: string;
  migrations: Migration[];

  constructor(migrations: Migration[], dataDir: string) {
    this.migrations = migrations;
    this.dataDir = dataDir;
  }

  getVersion() {
    const manifest = this.getManifest();
    if (manifest.version) {
      return manifest.version;
    }
    return 0;
  }

  getManifestPath() {
    return path.resolve(this.dataDir, MANIFEST_FILE);
  }

  getManifest() {
    const manifestPath = this.getManifestPath();

    if (!fs.existsSync(manifestPath)) {
      return {};
    }
    try {
      const contents = fs.readFileSync(manifestPath, "utf8");
      const json = JSON.parse(contents);
      return json;
    } catch (e) {
      log.error("Manifest file was in unexpected format");
      throw new Error("Manifest file was in unexpected format");
    }
  }

  getTargetVersion() {
    return this.migrations.length;
  }

  setManifestVersion(version: number) {
    const manifest = this.getManifest();
    manifest.version = version;
    fs.writeFileSync(
      this.getManifestPath(),
      JSON.stringify(manifest, null, 2) + "\n"
    );
  }

  executeMigration(index: number) {
    log.info("Running migration", index + 1);
    const migration = this.migrations[index]!;
    migration(this.dataDir);
    this.setManifestVersion(index + 1);
  }

  migrate() {
    const version = this.getVersion();
    const target = this.getTargetVersion();

    if (version === target) {
      return;
    }

    if (version > target) {
      log.warn(
        "Manifest version is newer than expected. This app might not work. YOLO"
      );
      return;
    }

    for (let i = version; i < target; i++) {
      this.executeMigration(i);
    }
  }
}

export class DataMigrator {
  migrations: Migration[];

  constructor(migrations: Migration[]) {
    this.migrations = migrations;
  }

  useDataDir(dataDir: string) {
    return new BoundDataMigrator(this.migrations, dataDir);
  }
}
