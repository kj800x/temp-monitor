import { useMemo } from "react";
import { useRecentDataQuery } from "../generated/graphql";
import { binarySearch } from "../library/binarySearch";

const FIVE_MINUTES = 5 * 60 * 1000;

const DAY = 24 * 60 * 60 * 1000;
const OFFSET = FIVE_MINUTES;

interface RawPoint {
  __typename?: "Datapoint";
  id: number;
  temperature: number;
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

export const useChartData = () => {
  const { loading, error, data } = useRecentDataQuery({
    pollInterval: FIVE_MINUTES,
  });

  const chartData = useMemo(() => {
    if (!data) {
      return data;
    }

    const rawPoints = data?.data;

    const points = [];

    const startOfToday = startOfDate().getTime();
    const startOfYesterday = startOfDate(-1).getTime();

    for (let i = 0; i < DAY; i += OFFSET) {
      points.push({
        time: i,
        today: binarySearch<RawPoint>(
          rawPoints!,
          compareTo(startOfToday, i, i + OFFSET)
        )?.temperature,
        yesterday: binarySearch<RawPoint>(
          rawPoints!,
          compareTo(startOfYesterday, i, i + OFFSET)
        )?.temperature,
      });
    }

    return points;
  }, [data]);

  return { loading, error, data, chartData };
};
