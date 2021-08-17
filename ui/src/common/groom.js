export const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
export const ONE_MINUTE_IN_MS = 1000 * 60;
export const ONE_HOUR_IN_MS = 1000 * 60 * 60;
export const FIFTEEN_SECONDS_IN_MS = 1000 * 15;

export const groomStates =
  (retention, bucket, windowEndsAt) => (oldStates, newData) => {
    const defaultedWindowEndsAt = windowEndsAt || new Date().getTime();

    const threshold = defaultedWindowEndsAt - (retention + bucket);

    while (!oldStates.isEmpty() && oldStates.peek().time < threshold) {
      oldStates.dequeue();
    }
    for (const datum of newData) {
      if (
        // Check if datum is newer than retention
        // or if it's past the end of the window
        datum.time < threshold ||
        datum.time > defaultedWindowEndsAt ||
        // Check if the most recent datum is not within BUCKET time
        (!oldStates.isEmpty() &&
          oldStates.peekBottom().time > datum.time - bucket)
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
