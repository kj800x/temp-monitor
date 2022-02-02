import { DataMigrator } from "../data-migrator";

import { migration as migration1 } from "./1";
import { migration as migration2 } from "./2";

const migrations = [migration1, migration2];

export const migrator = new DataMigrator(migrations);
