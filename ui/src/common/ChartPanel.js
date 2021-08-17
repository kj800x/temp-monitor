import React, { useState, useCallback, useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import { format as timeAgo } from "timeago.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";
import { startOfDay } from "../replay-index-route/ReplayIndexRoute";
import { ONE_DAY_IN_MS } from "./groom";

const DATE_OPTIONS = {
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const LatestTemperatureWrapper = styled.div`
  padding: 4px;
  width: 100%;
  text-align: center;
  font-size: 48px;
`;

const LatestTemperature = ({ latestData }) => {
  if (!latestData) {
    return null;
  }

  return (
    <LatestTemperatureWrapper>
      Now: {latestData ? latestData.temperature.toFixed(1) : ""} &deg;F
    </LatestTemperatureWrapper>
  );
};

const ChartPanelWrapper = styled.div`
  padding: 16px;
  flex: 1;
`;

function formatXAxis(x) {
  return timeAgo(x, "en_US");
}

function formatXAxisHours(x) {
  return new Date(x).toLocaleTimeString("en-US");
}

const ChartWrapper = ({ children }) => {
  const [safeWidth, setSafeWidth] = useState(window.innerWidth - 24);
  const [safeHeight, setSafeHeight] = useState((window.innerHeight - 200) / 2);

  const divRef = useRef();

  useLayoutEffect(() => {
    window.addEventListener("resize", () => {
      setSafeWidth(window.innerWidth - 24);
      setSafeHeight((window.innerHeight - 200) / 2);
    });
  });

  const childrenWithProps = React.Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        width: safeWidth,
        height: safeHeight,
      });
    }
    return child;
  });

  return <div ref={divRef}>{childrenWithProps}</div>;
};

export const ChartPanel = ({ shortData, longData, latestState, isReplay }) => {
  const [hidden, setHidden] = useState([]);

  const toggleVisibility = useCallback(
    ({ dataKey }) => {
      setHidden((oldHidden) =>
        oldHidden.includes(dataKey)
          ? oldHidden.filter((value) => value !== dataKey)
          : [...oldHidden, dataKey]
      );
    },
    [setHidden]
  );

  const computedLatestState = latestState;

  const longDomainMin = isReplay
    ? startOfDay(computedLatestState.time) - ONE_DAY_IN_MS
    : (computedLatestState ? computedLatestState.time : 0) -
      1000 * 60 * 60 * 24;
  const domainMin =
    (computedLatestState ? computedLatestState.time : 0) - 1000 * 60 * 60;
  const domainMax = isReplay
    ? startOfDay(computedLatestState.time)
    : computedLatestState
    ? computedLatestState.time
    : 0;

  return (
    <ChartPanelWrapper>
      {isReplay ? null : <LatestTemperature latestData={computedLatestState} />}
      {isReplay ? null : (
        <ChartWrapper>
          <LineChart
            data={[...shortData, latestState]}
            margin={{ top: 30, bottom: 10 }}
          >
            <XAxis
              allowDataOverflow={true}
              type="number"
              dataKey="time"
              domain={[domainMin, domainMax]}
              tickFormatter={isReplay ? formatXAxisHours : formatXAxis}
            />
            <YAxis domain={[65, 90]} tickCount={7} />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line
              dot={false}
              type="monotone"
              key={"temperature"}
              dataKey={"temperature"}
              stroke={"rgb(33 232 108)"}
              strokeWidth={2}
              isAnimationActive={false}
              hide={hidden.includes("temperature")}
            />
            <Tooltip
              labelFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", DATE_OPTIONS)
              }
              contentStyle={{ background: "rgb(28 38 49)" }}
              formatter={(v) => `${v.toFixed(2)} °F`}
            />
            <Legend onClick={toggleVisibility} height={10} />
          </LineChart>
        </ChartWrapper>
      )}
      <ChartWrapper>
        <LineChart
          data={[...longData, latestState]}
          margin={{ top: 30, bottom: 10 }}
        >
          <XAxis
            allowDataOverflow={true}
            type="number"
            dataKey="time"
            domain={[longDomainMin, domainMax]}
            tickCount={6}
            tickFormatter={isReplay ? formatXAxisHours : formatXAxis}
          />
          <YAxis domain={[65, 90]} tickCount={7} />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line
            dot={false}
            type="monotone"
            key={"temperature"}
            dataKey={"temperature"}
            stroke={"rgb(33 232 108)"}
            strokeWidth={2}
            isAnimationActive={false}
            hide={hidden.includes("temperature")}
          />
          <Tooltip
            labelFormatter={(v) =>
              new Date(v).toLocaleDateString("en-US", DATE_OPTIONS)
            }
            contentStyle={{ background: "rgb(28 38 49)" }}
            formatter={(v) => `${v.toFixed(2)} °F`}
          />
          <Legend onClick={toggleVisibility} height={10} />
        </LineChart>
      </ChartWrapper>
    </ChartPanelWrapper>
  );
};
