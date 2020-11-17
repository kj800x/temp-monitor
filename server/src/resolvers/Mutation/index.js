import { setLogging } from "../../logger";

export const Mutation = {
  resolver: {
    setLogging: (_, { logging }) => {
      setLogging(logging);
      return true;
    },
  },
};
