import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const ChartPanelWrapper = styled.div`
  padding: 4px;
  flex: 1;
  width: 100%;
`;

function formatXAxis(x) {
  const now = new Date().getTime();

  return Math.round((now - x) / 1000) + " sec ago";
}

function formatElapsedXAxis(x) {
  const min = Math.floor(x / 60000);
  const sec = Math.floor((x % 60000) / 1000);
  if (min > 0) {
    return `${min} min ${sec} sec`;
  }
  return `${sec} sec`;
}

export const ChartPanel = ({
  motorData,
  dataSpec,
  width,
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
  const domainMin = (latestMotorData ? latestMotorData.time : 0) - 60000;
  const domainMax = latestMotorData ? latestMotorData.time : 0;

  return (
    <ChartPanelWrapper>
      <LineChart
        width={width - 8}
        height={300}
        data={motorData}
        margin={{ top: 30, bottom: 10 }}
      >
        <XAxis
          allowDataOverflow={true}
          type="number"
          dataKey="time"
          domain={[domainMin, domainMax]}
          tickFormatter={useElapsedXAxis ? formatElapsedXAxis : formatXAxis}
        />
        <YAxis domain={[0, 1]} tickFormatter={(t) => t * 100 + "%"} />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        {dataSpec
          .filter((d) => d.chart === "motor")
          .map((d) => (
            <Line
              dot={false}
              type="monotone"
              key={d.key}
              dataKey={d.key}
              stroke={d.color}
              strokeWidth={2}
              isAnimationActive={false}
              hide={hidden.includes(d.key)}
            />
          ))}
        <Legend onClick={toggleVisibility} />
      </LineChart>
      <LineChart
        width={width - 8}
        height={300}
        data={motorData}
        margin={{ top: 30, bottom: 10 }}
      >
        <XAxis
          allowDataOverflow={true}
          type="number"
          dataKey="time"
          domain={[domainMin, domainMax]}
          tickFormatter={useElapsedXAxis ? formatElapsedXAxis : formatXAxis}
        />
        <YAxis domain={["auto", "auto"]} /> {/*domain={[12, 21]}*/}
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        {dataSpec
          .filter((d) => d.chart === "pressure")
          .map((d) => (
            <Line
              dot={false}
              type="monotone"
              key={d.key}
              dataKey={d.key}
              stroke={d.color}
              strokeWidth={2}
              isAnimationActive={false}
              hide={hidden.includes(d.key)}
            />
          ))}
        <Legend onClick={toggleVisibility} />
      </LineChart>
      <LineChart
        width={width - 8}
        height={300}
        data={motorData}
        margin={{ top: 30, bottom: 10 }}
      >
        <XAxis
          allowDataOverflow={true}
          type="number"
          dataKey="time"
          domain={[domainMin, domainMax]}
          tickFormatter={useElapsedXAxis ? formatElapsedXAxis : formatXAxis}
        />
        <YAxis domain={[0, 1]} tickFormatter={(t) => t * 100 + "%"} />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        {dataSpec
          .filter((d) => d.chart === "status")
          .map((d) => (
            <Line
              dot={false}
              type="monotone"
              key={d.key}
              dataKey={d.key}
              stroke={d.color}
              strokeWidth={2}
              isAnimationActive={false}
              hide={hidden.includes(d.key)}
            />
          ))}
        <Legend onClick={toggleVisibility} />
      </LineChart>
    </ChartPanelWrapper>
  );
};
