import { getLogging } from "../logger";

export const AppState = {
  resolver: {
    id: () => 1,
    logging: getLogging,
  },
};
