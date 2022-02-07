import { ErrorDisplay } from "../../library/ErrorDisplay";
import { Loading } from "../../library/Loading";
import { useWeekChartData } from "./useWeekData";
import { startOfDate } from "../../features/useChartData";
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
import { useAppState } from "../../library/hooks/useAppState";
import { useCallback, useState } from "react";

const TEMPERATURE: Series = "temperature";
const HUMIDITY: Series = "humidity";

type Series = "temperature" | "humidity";

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

function getFormattedSeriesName(name: Series) {
  switch (name) {
    case TEMPERATURE: {
      return "Temperature";
    }
    case HUMIDITY: {
      return "Humidity";
    }
  }
}

const domainPadding = (isMetric: boolean) => (isMetric ? 3 : 5);

export const WeekChart = () => {
  const [inMetric] = useAppState<boolean>("useMetric", false);
  const { chartData, loading, error } = useWeekChartData(inMetric);

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

  const rawValues =
    chartData?.flatMap((d) => (d.temperature ? [d.temperature] : [])) || [];

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
            interval={window.innerWidth < 1000 ? 47 : 23}
            tickFormatter={(time: number) =>
              new Date(startOfToday + time).toLocaleString(undefined, {
                hour: "numeric",
                day: "numeric",
                month: "short",
                weekday: "short",
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
                day: "numeric",
                month: "short",
                weekday: "short",
                hour: "numeric",
                minute: "numeric",
              })
            }
            formatter={(value: number, name: Series) => {
              if (name === HUMIDITY) {
                return [`${value.toFixed(1)}%`, getFormattedSeriesName(name)];
              } else {
                return [
                  `${value.toFixed(1)} °${inMetric ? "C" : "F"}`,
                  getFormattedSeriesName(name),
                ];
              }
            }}
          />
          <CartesianGrid stroke="#eee" strokeDasharray="1 8" />
          <Legend
            onClick={toggleVisibility as any}
            formatter={getFormattedSeriesName}
          />
          <Line
            yAxisId="left"
            type="basis"
            dot={false}
            strokeWidth={5}
            dataKey={TEMPERATURE}
            strokeLinecap="round"
            stroke="#a2d28f"
            hide={hidden.includes(TEMPERATURE)}
            z={"10"}
          />
          <Line
            yAxisId="right"
            type="basis"
            dot={false}
            dataKey={HUMIDITY}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="1 5"
            stroke="#51d3d9"
            hide={hidden.includes(HUMIDITY)}
          />
        </LineChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};
