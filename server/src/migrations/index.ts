import { DataMigrator } from "../data-migrator";

import { migration as migration1 } from "./1";

const migrations = [migration1];

export const migrator = new DataMigrator(migrations);
