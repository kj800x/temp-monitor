import loglevel from "loglevel";
import betterSqlite3 from "better-sqlite3";
import path from "path";
import { DATA_DIR } from "./env/dataDir";
import { VERBOSE_DB } from "./env/verboseDb";

export const db = betterSqlite3(path.resolve(DATA_DIR, "db.db"), {
  verbose: VERBOSE_DB ? loglevel.getLogger("db").debug : undefined,
});

function chunk<T>(chunkSize: number, array: readonly T[]) {
  return array.reduce<T[][]>(function (previous, current) {
    var chunk: T[];
    if (
      previous.length === 0 ||
      previous[previous.length - 1]!.length === chunkSize
    ) {
      chunk = [];
      previous.push(chunk);
    } else {
      chunk = previous[previous.length - 1]!;
    }
    chunk.push(current);
    return previous;
  }, []);
}

export function prepareIn<Params, Result>(statement: string) {
  return {
    all: function all(arr: readonly Params[]): Result[] {
      if (arr.length > 999) {
        return chunk(999, arr).flatMap(all);
      }

      const sql = statement.replace("!?!", arr.map((_) => "?").join());
      return db.prepare(sql).all(...arr);
    },
  };
}

// @ts-expect-error Typescript doesn't like me extending the db object. I should maybe wrap the better-sqlite3 methods.
db.prepareIn = prepareIn;

db.pragma("journal_mode = WAL");

process.on("exit", () => db.close());
process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));
