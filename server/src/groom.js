const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const ONE_MINUTE_IN_MS = 1000 * 60;
const ONE_HOUR_IN_MS = 1000 * 60 * 60;
const FIFTEEN_SECONDS_IN_MS = 1000 * 15;

export const groomStates = (retention, bucket) => (oldStates, newData) => {
  while (!oldStates.isEmpty() && oldStates.peek().time < retention) {
    oldStates.dequeue();
  }
  for (const datum of newData) {
    // Check if datum is newer than retention
    if (datum.time < retention) {
      continue;
    }
    // Check if the most recent datum is not within BUCKET time
    if (
      !oldStates.isEmpty() &&
      oldStates.peekBottom().time > datum.time - bucket
    ) {
      continue;
    }
    oldStates.enqueue(datum);
  }
  return oldStates;
};

export const groomLongStates = groomStates(ONE_DAY_IN_MS, ONE_MINUTE_IN_MS);
export const groomShortStates = groomStates(
  ONE_HOUR_IN_MS,
  FIFTEEN_SECONDS_IN_MS
);
