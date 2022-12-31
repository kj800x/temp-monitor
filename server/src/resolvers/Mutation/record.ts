import { db } from "../../db";
import { DatapointLoaderType } from "../../domain-objects/Datapoint";
import { pubsub } from "../../pubsub";
import { authRequired } from "./authRequired";
import { MutationFunction } from "./types";

const insert = db.prepare(
  "INSERT INTO Datapoint (source, temperature, humidity, date) VALUES (?, ?, ?, ?)"
);

export const record: MutationFunction<
  {
    source: string | null;
    temperature: number;
    humidity: number;
    date: Date | null;
  },
  DatapointLoaderType
> = authRequired(
  async (_, { source, temperature, humidity, date }, context) => {
    const id = insert.run(
      source || "office",
      temperature,
      humidity,
      (date || new Date()).getTime()
    ).lastInsertRowid as number;

    pubsub.publish("liveTemperature", {
      liveTemperature: id,
    });

    return context.loaders.Datapoint.load(id);
  }
);
