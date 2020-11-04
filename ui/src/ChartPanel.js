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

export const ChartPanel = ({
  historicalMotorData,
  currentMotorData,
  width,
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

  const domainMin = currentMotorData ? currentMotorData.time - 60000 : 0;
  const domainMax = currentMotorData ? currentMotorData.time : 0;

  return (
    <ChartPanelWrapper>
      <LineChart
        width={width - 8}
        height={300}
        data={historicalMotorData}
        margin={{ top: 30, bottom: 10 }}
      >
        <XAxis
          allowDataOverflow={true}
          type="number"
          dataKey="time"
          domain={[domainMin, domainMax]}
          tickFormatter={formatXAxis}
        />
        <YAxis domain={[0, 1]} tickFormatter={(t) => t * 100 + "%"} />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line
          dot={false}
          type="monotone"
          dataKey="target"
          stroke="#82ca9d"
          strokeWidth={2}
          isAnimationActive={false}
          hide={hidden.includes("target")}
        />
        <Line
          dot={false}
          type="monotone"
          dataKey="motor"
          stroke="#ffff00"
          strokeWidth={2}
          isAnimationActive={false}
          hide={hidden.includes("motor")}
        />
        <Legend onClick={toggleVisibility} />
      </LineChart>
      <LineChart
        width={width - 8}
        height={300}
        data={historicalMotorData}
        margin={{ top: 30, bottom: 10 }}
      >
        <XAxis
          allowDataOverflow={true}
          type="number"
          dataKey="time"
          domain={[domainMin, domainMax]}
          tickFormatter={formatXAxis}
        />
        <YAxis domain={[12, 21]} />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line
          dot={false}
          type="monotone"
          dataKey="pressure"
          stroke="#8884d8"
          strokeWidth={2}
          isAnimationActive={false}
          hide={hidden.includes("pressure")}
        />
        <Line
          dot={false}
          type="monotone"
          dataKey="avg"
          stroke="#00ffff"
          strokeWidth={2}
          isAnimationActive={false}
          hide={hidden.includes("avg")}
        />
        <Legend onClick={toggleVisibility} />
      </LineChart>
      <LineChart
        width={width - 8}
        height={300}
        data={historicalMotorData}
        margin={{ top: 30, bottom: 10 }}
      >
        <XAxis
          allowDataOverflow={true}
          type="number"
          dataKey="time"
          domain={[domainMin, domainMax]}
          tickFormatter={formatXAxis}
        />
        <YAxis domain={[0, 1]} tickFormatter={(t) => t * 100 + "%"} />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line
          dot={false}
          type="monotone"
          dataKey="limit"
          stroke="#00ffff"
          strokeWidth={2}
          isAnimationActive={false}
          hide={hidden.includes("limit")}
        />
        <Line
          dot={false}
          type="monotone"
          dataKey="status"
          stroke="#ff0000"
          strokeWidth={2}
          isAnimationActive={false}
          hide={hidden.includes("status")}
        />
        <Legend onClick={toggleVisibility} />
      </LineChart>
    </ChartPanelWrapper>
  );
};
