import { useEffect, useMemo, useRef } from "react";
import { useSevenDayQuery } from "../../generated/graphql";
import { binarySearch } from "../../library/binarySearch";
import { fToC } from "../../features/CurrentTemperature";

const ONE_HOUR = 60 * 60 * 1000;
const DAY = 24 * ONE_HOUR;
const SEVEN_DAYS = 7 * DAY;

const OFFSET = ONE_HOUR;

interface RawPoint {
  __typename?: "Datapoint";
  id: number;
  temperature: number;
  humidity?: number | null;
  date: any;
}

export const startOfDate = (
  daysOffset: number = 0,
  date: Date = new Date()
) => {
  const out = new Date(date);
  out.setDate(out.getDate() + daysOffset);
  out.setMilliseconds(0);
  out.setSeconds(0);
  out.setMinutes(0);
  out.setHours(0);
  return out;
};

const compareTo =
  (base: number, startOffset: number, endOffset: number) =>
  ({ date }: { date: number }) => {
    if (date > base + endOffset) {
      return -1;
    }
    if (date < base + startOffset) {
      return 1;
    }
    return 0;
  };

export const usePreviousNonNullish = <T, B>(
  value: T,
  associated: B
): [T, B] => {
  const ref = useRef<[T, B]>([value, associated]);
  useEffect(() => {
    if (value !== null && value !== undefined) {
      ref.current = [value, associated];
    }
  });
  return ref.current;
};

export const useWeekChartData = (inMetric: boolean) => {
  const { loading, error, data } = useSevenDayQuery({
    pollInterval: ONE_HOUR,
  });

  const chartData = useMemo(() => {
    if (!data) {
      return undefined;
    }

    const rawPoints = inMetric
      ? data?.sevenDays.map((d) => ({ ...d, temperature: fToC(d.temperature) }))
      : data?.sevenDays;

    const points = [];

    const startOfSevenDays = startOfDate(-7).getTime();

    for (let i = 0; i < SEVEN_DAYS; i += OFFSET) {
      points.push({
        time: i,
        temperature: binarySearch<RawPoint>(
          rawPoints!,
          compareTo(startOfSevenDays, i, i + OFFSET)
        )?.temperature,
        humidity: binarySearch<RawPoint>(
          rawPoints!,
          compareTo(startOfSevenDays, i, i + OFFSET)
        )?.humidity,
      });
    }

    return points;
  }, [data, inMetric]);

  return {
    loading,
    error,
    data,
    chartData,
  };
};
