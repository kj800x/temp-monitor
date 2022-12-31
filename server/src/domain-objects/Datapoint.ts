import { prepareIn } from "../db";
import { get } from "../util/get";
import { order } from "../util/ordering";
import type { DomainObject } from "./types";

export type DatapointLoaderType = {
  source: string;
  id: number;
  temperature: number;
  humidity: number;
  date: number;
};
export type DatapointType = {
  source: string;
  id: number;
  temperature: number;
  humidity: number;
  date: number;
};

const LOADER = prepareIn<number, DatapointLoaderType>(
  "SELECT * FROM Datapoint WHERE id IN (!?!)"
);

export const Datapoint: DomainObject<DatapointType, DatapointLoaderType> = {
  resolver: {
    source: get("source"),
    id: get("id"),
    temperature: get("temperature"),
    humidity: get("humidity"),
    date: get("date"),
  },
  loader: (ids: readonly number[]) => {
    const result = LOADER.all(ids);
    return order(result, ids);
  },
};
