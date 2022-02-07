import { ErrorDisplay } from "../library/ErrorDisplay";
import { Loading } from "../library/Loading";
import { startOfDate, useChartData } from "./useChartData";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAppState } from "../library/hooks/useAppState";
import { useCallback, useState } from "react";

const TODAY: Series = "today";
const TODAY_H: Series = "todayH";
const YESTERDAY: Series = "yesterday";
const YESTERDAY_H: Series = "yesterdayH";
const REFERENCE: Series = "reference";
const REFERENCE_H: Series = "referenceH";

type Series =
  | "today"
  | "todayH"
  | "yesterday"
  | "yesterdayH"
  | "reference"
  | "referenceH";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-top: 16px;
  height: calc(100% - 32px);

  & *.recharts-text {
    fill: white !important;
  }

  & *.recharts-default-tooltip {
    background: #2d3e50 !important;
    .recharts-tooltip-label {
    }
  }
`;

function getFormattedSeriesName(name: Series, referenceDate: Date) {
  switch (name) {
    case TODAY: {
      return "Today (temperature)";
    }
    case YESTERDAY: {
      return "Yesterday (temperature)";
    }
    case REFERENCE: {
      return `${referenceDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} (temperature)`;
    }
    case TODAY_H: {
      return "Today (humidity)";
    }
    case YESTERDAY_H: {
      return "Yesterday (humidity)";
    }
    case REFERENCE_H: {
      return `${referenceDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} (humidity)`;
    }
  }
}

const domainPadding = (isMetric: boolean) => (isMetric ? 3 : 5);

export const HomeChart = () => {
  const [referenceDate] = useAppState<null | number>("referenceDate", null);

  const [inMetric] = useAppState<boolean>("useMetric", false);
  const { chartData, loading, error, referenceData } = useChartData(
    inMetric,
    referenceDate
  );

  const [hidden, setHidden] = useState<string[]>([]);

  const toggleVisibility = useCallback<
    ({ dataKey }: { dataKey: string }) => void
  >(
    ({ dataKey }) => {
      setHidden((oldHidden) =>
        oldHidden.includes(dataKey)
          ? oldHidden.filter((value) => value !== dataKey)
          : [...oldHidden, dataKey]
      );
    },
    [setHidden]
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const startOfToday = startOfDate().getTime();

  const rawValues = chartData
    ? [
        ...chartData.flatMap((d) => (d.today ? [d.today] : [])),
        ...chartData.flatMap((d) => (d.yesterday ? [d.yesterday] : [])),
        ...chartData.flatMap((d) => (d.reference ? [d.reference] : [])),
      ]
    : [];

  const dataMin = Math.min(...rawValues);
  const dataMax = Math.max(...rawValues);

  if (!isFinite(dataMax)) {
    return <ErrorDisplay error={new Error("No data")} />;
  }

  return (
    <Wrapper>
      <ResponsiveContainer height="100%" width="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 0,
            left: 5,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="time"
            interval={
              window.innerWidth > 1230 ? 11 : window.innerWidth < 700 ? 47 : 23
            }
            tickFormatter={(time: number) =>
              new Date(startOfToday + time).toLocaleTimeString("en-us", {
                hour: "numeric",
                // minute: "numeric", // Uncomment this if you mess with interval
              })
            }
          />
          <YAxis
            yAxisId="left"
            domain={[
              Math.floor(dataMin) - domainPadding(inMetric),
              Math.ceil(dataMax) + domainPadding(inMetric),
            ]}
            tickCount={15}
            allowDecimals={false}
            tickFormatter={(temp: number) =>
              `${temp.toFixed(1)} °${inMetric ? "C" : "F"}`
            }
          />
          <YAxis
            domain={[0, 100]}
            yAxisId="right"
            orientation="right"
            tickFormatter={(percent: number) => `${percent}%`}
          />
          <Tooltip
            labelFormatter={(time: number) =>
              new Date(startOfToday + time).toLocaleTimeString("en-us", {
                hour: "numeric",
                minute: "numeric", // Uncomment this if you mess with interval
              })
            }
            formatter={(value: number, name: Series) => {
              if (
                name === YESTERDAY_H ||
                name === TODAY_H ||
                name === REFERENCE_H
              ) {
                return [
                  `${value.toFixed(1)}%`,
                  getFormattedSeriesName(name, new Date(referenceDate || 0)),
                ];
              } else {
                return [
                  `${value.toFixed(1)} °${inMetric ? "C" : "F"}`,
                  getFormattedSeriesName(name, new Date(referenceDate || 0)),
                ];
              }
            }}
          />
          <CartesianGrid stroke="#eee" strokeDasharray="1 8" />
          <Legend
            onClick={toggleVisibility as any}
            formatter={(name: Series) =>
              getFormattedSeriesName(name, new Date(referenceDate || 0))
            }
          />
          <Line
            yAxisId="left"
            type="basis"
            dot={false}
            strokeWidth={2.5}
            dataKey={YESTERDAY}
            strokeLinecap="round"
            stroke="#ea90b1"
            hide={hidden.includes(YESTERDAY)}
          />
          <Line
            yAxisId="right"
            type="basis"
            dot={false}
            dataKey={YESTERDAY_H}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="1 5"
            stroke="#ea90b1"
            hide={hidden.includes(YESTERDAY_H)}
          />
          <Line
            yAxisId="left"
            type="basis"
            dot={false}
            strokeWidth={5}
            dataKey={TODAY}
            strokeLinecap="round"
            stroke="#a2d28f"
            hide={hidden.includes(TODAY)}
            z={"10"}
          />
          <Line
            yAxisId="right"
            type="basis"
            dot={false}
            dataKey={TODAY_H}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="1 5"
            stroke="#a2d28f"
            hide={hidden.includes(TODAY_H)}
          />
          {referenceDate && referenceData ? (
            <Line
              yAxisId="left"
              type="basis"
              dot={false}
              strokeWidth={2.5}
              dataKey={REFERENCE}
              strokeLinecap="round"
              stroke="#51d3d9"
              hide={hidden.includes(REFERENCE)}
            />
          ) : null}
          {referenceDate && referenceData ? (
            <Line
              yAxisId="right"
              type="basis"
              dot={false}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray="1 5"
              dataKey={REFERENCE_H}
              stroke="#51d3d9"
              hide={hidden.includes(REFERENCE_H)}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};
