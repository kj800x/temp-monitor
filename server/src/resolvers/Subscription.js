import { pubsub } from "../pubsub";

export const Subscription = {
  resolver: {
    stateUpdate: {
      subscribe: () => pubsub.asyncIterator("stateUpdate"),
    },
  },
};
