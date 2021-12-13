import { db } from "../db";
import { NoLoaderDomainObject } from "../domain-objects/types";
import { DatapointLoaderType } from "../domain-objects/Datapoint";

const FETCH_RECENT_DATA = db
  .prepare("SELECT id FROM Datapoint WHERE date >= ? ORDER BY date ASC")
  .pluck();

type QueryType = {
  data: (DatapointLoaderType | Error)[];
};

export const Query: NoLoaderDomainObject<QueryType, null> = {
  resolver: {
    data: (_parent, _args, context) => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const ids = FETCH_RECENT_DATA.all(twoDaysAgo.getTime());
      return context.loaders.Datapoint.loadMany(ids);
    },
  },
};
