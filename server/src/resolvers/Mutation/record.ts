import { db } from "../../db";
import { DatapointLoaderType } from "../../domain-objects/Datapoint";
import { pubsub } from "../../pubsub";
import { authRequired } from "./authRequired";
import { MutationFunction } from "./types";

const insert = db.prepare(
  "INSERT INTO Datapoint (temperature, humidity, date) VALUES (?, ?, ?)"
);

export const record: MutationFunction<
  { temperature: number; humidity: number; date: Date },
  DatapointLoaderType
> = authRequired(async (_, { temperature, humidity, date }, context) => {
  const id = insert.run(temperature, humidity, date.getTime())
    .lastInsertRowid as number;

  pubsub.publish("liveTemperature", {
    liveTemperature: id,
  });

  return context.loaders.Datapoint.load(id);
});
