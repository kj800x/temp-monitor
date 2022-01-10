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

const TODAY = "today";
const YESTERDAY = "yesterday";

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

const domainPadding = (isMetric: boolean) => (isMetric ? 3 : 5);

export const HomeChart = () => {
  const [inMetric] = useAppState<boolean>("useMetric", false);
  const { chartData, loading, error } = useChartData(inMetric);

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
      ]
    : [];

  const dataMin = Math.min(...rawValues);
  const dataMax = Math.max(...rawValues);

  return (
    <Wrapper>
      <ResponsiveContainer height="100%" width="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
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
          <Tooltip
            labelFormatter={(time: number) =>
              new Date(startOfToday + time).toLocaleTimeString("en-us", {
                hour: "numeric",
                minute: "numeric", // Uncomment this if you mess with interval
              })
            }
            formatter={(temp: number) =>
              `${temp.toFixed(1)} °${inMetric ? "C" : "F"}`
            }
          />
          <CartesianGrid stroke="#eee" strokeDasharray="1 8" />
          <Legend onClick={toggleVisibility as any} />
          <Line
            type="natural"
            dot={false}
            strokeWidth={2}
            dataKey="yesterday"
            strokeDasharray="6 4"
            stroke="#ea90b1"
            hide={hidden.includes(YESTERDAY)}
          />
          <Line
            type="natural"
            dot={false}
            strokeWidth={5}
            dataKey="today"
            stroke="#a2d28f"
            hide={hidden.includes(TODAY)}
          />
        </LineChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};
