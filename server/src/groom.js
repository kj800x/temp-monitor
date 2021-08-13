const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const ONE_MINUTE_IN_MS = 1000 * 60;
const ONE_HOUR_IN_MS = 1000 * 60 * 60;
const FIFTEEN_SECONDS_IN_MS = 1000 * 15;

const uniqueBy = (keyFn) => (e, i, a) => {
  return i === a.findIndex((x) => keyFn(e) === keyFn(x));
};

export const groomStates = (retention, bucket) => (data) => {
  return data
    .filter((d) => d.time > retention)
    .filter(uniqueBy((d) => Math.floor(d.time / bucket)));
};

export const groomLongStates = groomStates(ONE_DAY_IN_MS, ONE_MINUTE_IN_MS);
export const groomShortStates = groomStates(
  ONE_HOUR_IN_MS,
  FIFTEEN_SECONDS_IN_MS
);
