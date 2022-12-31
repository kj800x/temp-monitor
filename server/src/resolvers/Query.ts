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

const FETCH_HIGH_LOWS = db.prepare(
  "SELECT date(`date`/1000, 'unixepoch', '-5 hours') as date, 'office' as source, min(temperature) as tempLow, max(temperature) as tempHigh, min(humidity) as humidityLow, max(humidity) as humidityHigh FROM Datapoint WHERE date >= ? AND source = 'office' GROUP BY date(`date`/1000, 'unixepoch', '-5 hours')"
);

interface HighLowType {
  source: string;
  date: string;
  tempHigh: number;
  tempLow: number;
  humidityHigh: number;
  humidityLow: number;
}

type QueryType = {
  data: (DatapointLoaderType | Error)[];
  sevenDays: (DatapointLoaderType | Error)[];
  highLows: (HighLowType | Error)[];
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
    highLows: () => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const data: HighLowType[] = FETCH_HIGH_LOWS.all(oneYearAgo.getTime());
      return data;
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
