import { db } from "../../db";
import { DatapointLoaderType } from "../../domain-objects/Datapoint";
import { readAPIKey } from "../../env/apiKey";
import { pubsub } from "../../pubsub";
import { MutationFunction } from "./types";

const insert = db.prepare(
  "INSERT INTO Datapoint (temperature, humidity, date) VALUES (?, ?, ?)"
);

const expectedApiKey = readAPIKey();

export const record: MutationFunction<
  { apiKey: string; temperature: number; humidity: number; date: Date },
  DatapointLoaderType
> = async (_, { apiKey, temperature, humidity, date }, context) => {
  if (apiKey !== expectedApiKey) {
    throw new Error("Invalid API key provided");
  }

  const id = insert.run(temperature, humidity, date.getTime())
    .lastInsertRowid as number;

  pubsub.publish("liveTemperature", {
    liveTemperature: id,
  });

  return context.loaders.Datapoint.load(id);
};
