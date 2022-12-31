import { DataMigrator } from "../data-migrator";

import { migration as migration1 } from "./1";
import { migration as migration2 } from "./2";
import { migration as migration3 } from "./3";

const migrations = [migration1, migration2, migration3];

export const migrator = new DataMigrator(migrations);
