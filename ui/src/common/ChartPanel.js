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

const LatestTemperature = ({ latestMotorData }) => {
  return (
    <LatestTemperatureWrapper>
      Currently: {latestMotorData ? latestMotorData.temperature.toFixed(1) : ""}{" "}
      &deg;F
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

function formatElapsedXAxis(x) {
  const min = Math.floor(x / 60000);
  const sec = Math.floor((x % 60000) / 1000);
  if (min > 0) {
    return `${min} min ${sec} sec`;
  }
  return `${sec} sec`;
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

export const ChartPanel = ({
  motorData,
  longMotorData,
  useElapsedXAxis = false,
}) => {
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

  const latestMotorData = motorData[motorData.length - 1];
  const longDomainMin =
    (latestMotorData ? latestMotorData.time : 0) - 1000 * 60 * 60 * 24;
  const domainMin =
    (latestMotorData ? latestMotorData.time : 0) - 1000 * 60 * 60;
  const domainMax = latestMotorData ? latestMotorData.time : 0;

  return (
    <ChartPanelWrapper>
      <LatestTemperature latestMotorData={latestMotorData} />
      <ChartWrapper>
        <LineChart data={motorData} margin={{ top: 30, bottom: 10 }}>
          <XAxis
            allowDataOverflow={true}
            type="number"
            dataKey="time"
            domain={[domainMin, domainMax]}
            tickFormatter={useElapsedXAxis ? formatElapsedXAxis : formatXAxis}
          />
          <YAxis domain={[50, 100]} />
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
      <ChartWrapper>
        <LineChart data={longMotorData} margin={{ top: 30, bottom: 10 }}>
          <XAxis
            allowDataOverflow={true}
            type="number"
            dataKey="time"
            domain={[longDomainMin, domainMax]}
            tickFormatter={useElapsedXAxis ? formatElapsedXAxis : formatXAxis}
          />
          <YAxis domain={[50, 100]} />
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
