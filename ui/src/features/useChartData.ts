import { useMemo } from "react";
import {
  useRecentDataQuery,
  useReferenceDataQuery,
} from "../generated/graphql";
import { binarySearch } from "../library/binarySearch";
import { fToC } from "./CurrentTemperature";

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

export const useChartData = (
  inMetric: boolean,
  referenceDate: number | null
) => {
  const { loading, error, data } = useRecentDataQuery({
    pollInterval: FIVE_MINUTES,
  });

  const {
    loading: referenceLoading,
    error: referenceError,
    data: referenceData,
  } = useReferenceDataQuery({
    variables: {
      date: referenceDate || 0,
    },
    skip: !referenceDate,
  });

  const chartData = useMemo(() => {
    if (!data) {
      return undefined;
    }

    const rawPoints = inMetric
      ? data?.data.map((d) => ({ ...d, temperature: fToC(d.temperature) }))
      : data?.data;

    const rawReferencePoints = inMetric
      ? referenceData?.historicalData.map((d) => ({
          ...d,
          temperature: fToC(d.temperature),
        }))
      : referenceData?.historicalData;

    const points = [];

    const startOfToday = startOfDate().getTime();
    const startOfYesterday = startOfDate(-1).getTime();
    const startOfReference = startOfDate(
      0,
      new Date(referenceDate || 0)
    ).getTime();

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
        ...(rawReferencePoints && rawReferencePoints.length > 0
          ? {
              reference: binarySearch<RawPoint>(
                rawReferencePoints!,
                compareTo(startOfReference, i, i + OFFSET)
              )?.temperature,
            }
          : {}),
      });
    }

    return points;
  }, [data, referenceData, referenceDate, inMetric]);

  return { loading, error, data, chartData, referenceLoading, referenceError };
};
