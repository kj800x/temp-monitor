import { pubsub } from "../pubsub";
import { buildDataLoaders } from "../schema";

export const Subscription = {
  resolver: {
    liveTemperature: {
      resolve: ({ liveTemperature: id }: { liveTemperature: number }) => {
        return buildDataLoaders().Datapoint.load(id);
      },
      subscribe: () => pubsub.asyncIterator("liveTemperature"),
    },
  },
};
