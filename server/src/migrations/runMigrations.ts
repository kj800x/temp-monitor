import "../logSetup";
import log from "loglevel";
import { migrator } from ".";
import { DATA_DIR } from "../env/dataDir";

async function main() {
  const dataMigrator = migrator.useDataDir(DATA_DIR);
  dataMigrator.migrate();
}

main().catch(log.error);
