import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ChartPanel } from "../common/ChartPanel";
import Error from "../common/Error";
import Loading from "../common/Loading";
import { useKeys } from "../common/useKeys";

import { useReplayMotorData } from "./useReplayMotorData";

const ReplayChartsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Controls = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

export const ReplayCharts = ({ windowWidth, file }) => {
  const { historicalMotorData, loading, error } = useReplayMotorData({ file });
  const [timestamp, setTimestamp] = useState(45000);
  const [isPlaying, setIsPlaying] = useState(false);

  useKeys({
    ArrowLeft: () => setTimestamp((ts) => ts - 5000),
    ArrowRight: () => setTimestamp((ts) => ts + 5000),
    Space: () => setIsPlaying((p) => !p),
  });

  useEffect(() => {
    if (isPlaying) {
      const i = setInterval(() => {
        setTimestamp((t) => t + 50);
      }, 50);
      return () => {
        clearInterval(i);
      };
    }
  }, [isPlaying, timestamp]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <ReplayChartsWrapper>
      <ChartPanel
        historicalMotorData={historicalMotorData.filter(
          (d) => (d.time > timestamp - 60000) & (d.time <= timestamp)
        )}
        currentMotorData={{ time: timestamp }}
        width={windowWidth}
        useElapsedXAxis={true}
      />
      <Controls>
        <input
          style={{ flex: 1 }}
          type="range"
          min={historicalMotorData[0].time}
          max={historicalMotorData[historicalMotorData.length - 1].time}
          value={timestamp}
          onChange={(event) => {
            setTimestamp(parseInt(event.target.value, 10));
          }}
        />
        <button
          onClick={() => {
            setIsPlaying((p) => !p);
          }}
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
      </Controls>
    </ReplayChartsWrapper>
  );
};
