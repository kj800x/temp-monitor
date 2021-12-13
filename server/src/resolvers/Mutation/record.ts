import { db } from "../../db";
import { DatapointLoaderType } from "../../domain-objects/Datapoint";
import { pubsub } from "../../pubsub";
import { MutationFunction } from "./types";

const insert = db.prepare(
  "INSERT INTO Datapoint (temperature, date) VALUES (?, ?)"
);

export const record: MutationFunction<
  { temperature: number; date: Date },
  DatapointLoaderType
> = async (_, { temperature, date }, context) => {
  const id = insert.run(temperature, date.getTime()).lastInsertRowid as number;

  pubsub.publish("liveTemperature", {
    liveTemperature: id,
  });

  return context.loaders.Datapoint.load(id);
};
