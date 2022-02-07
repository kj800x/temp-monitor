import { db } from "../db";
import { NoLoaderDomainObject } from "../domain-objects/types";
import { DatapointLoaderType } from "../domain-objects/Datapoint";

const FETCH_RECENT_DATA = db
  .prepare("SELECT id FROM Datapoint WHERE date >= ? ORDER BY date ASC")
  .pluck();

const FETCH_HISTORICAL_DATA = db
  .prepare(
    "SELECT id FROM Datapoint WHERE date >= ? AND date <= ? ORDER BY date ASC"
  )
  .pluck();

type QueryType = {
  data: (DatapointLoaderType | Error)[];
  sevenDays: (DatapointLoaderType | Error)[];
  historicalData: (DatapointLoaderType | Error)[];
};

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

export const Query: NoLoaderDomainObject<QueryType, null> = {
  resolver: {
    data: (_parent, _args, context) => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const ids = FETCH_RECENT_DATA.all(twoDaysAgo.getTime());
      return context.loaders.Datapoint.loadMany(ids);
    },
    sevenDays: (_parent, _args, context) => {
      const eightDaysAgo = new Date();
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
      const ids = FETCH_RECENT_DATA.all(eightDaysAgo.getTime());
      return context.loaders.Datapoint.loadMany(ids);
    },
    historicalData: (_parent, args: { date: Date }, context) => {
      const ids = FETCH_HISTORICAL_DATA.all(
        args.date.getTime(),
        args.date.getTime() + ONE_DAY_IN_MS
      );
      return context.loaders.Datapoint.loadMany(ids);
    },
  },
};
