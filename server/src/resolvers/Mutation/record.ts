import { AuthenticationError } from "apollo-server-express";
import { db } from "../../db";
import { DatapointLoaderType } from "../../domain-objects/Datapoint";
import { pubsub } from "../../pubsub";
import { MutationFunction } from "./types";

const insert = db.prepare(
  "INSERT INTO Datapoint (temperature, humidity, date) VALUES (?, ?, ?)"
);

export const record: MutationFunction<
  { temperature: number; humidity: number; date: Date },
  DatapointLoaderType
> = async (_, { temperature, humidity, date }, context) => {
  if (context.auth.status !== "authenticated") {
    throw new AuthenticationError(
      "This mutation requires auth and the client did not provide a valid JWT token"
    );
  }

  const id = insert.run(temperature, humidity, date.getTime())
    .lastInsertRowid as number;

  pubsub.publish("liveTemperature", {
    liveTemperature: id,
  });

  return context.loaders.Datapoint.load(id);
};
