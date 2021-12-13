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
} from "recharts";
import { useAppState } from "../library/hooks/useAppState";
import { fToC } from "./CurrentTemperature";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
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

export const HomeChart = () => {
  const [inMetric] = useAppState<boolean>("useMetric", false);
  const { chartData, loading, error } = useChartData();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const startOfToday = startOfDate().getTime();

  return (
    <Wrapper>
      <ResponsiveContainer height="100%" width="100%">
        <LineChart
          width={500}
          height={300}
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
            interval={23}
            tickFormatter={(time: number) =>
              new Date(startOfToday + time).toLocaleTimeString("en-us", {
                hour: "numeric",
                // minute: "numeric", // Uncomment this if you mess with interval
              })
            }
          />
          <YAxis
            domain={["dataMin - 10", "dataMax + 10"]}
            tickCount={12}
            tickFormatter={(f: number) =>
              `${inMetric ? fToC(f).toFixed(1) : f.toFixed(1)} °${
                inMetric ? "C" : "F"
              }`
            }
          />
          <Tooltip
            labelFormatter={(time: number) =>
              new Date(startOfToday + time).toLocaleTimeString("en-us", {
                hour: "numeric",
                minute: "numeric", // Uncomment this if you mess with interval
              })
            }
            formatter={(f: number) =>
              `${inMetric ? fToC(f).toFixed(1) : f.toFixed(1)} °${
                inMetric ? "C" : "F"
              }`
            }
          />
          <CartesianGrid stroke="#eee" strokeDasharray="1 8" />
          <Line
            type="natural"
            dot={false}
            connectNulls={true}
            strokeWidth={3}
            dataKey="today"
            stroke="#a2d28f"
          />
          <Line
            type="natural"
            dot={false}
            connectNulls={true}
            strokeWidth={3}
            dataKey="yesterday"
            strokeDasharray="4 4"
            stroke="#ea90b1"
          />
        </LineChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};
