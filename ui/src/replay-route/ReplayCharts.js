import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { ChartPanel } from "../common/ChartPanel";
import Error from "../common/Error";
import Loading from "../common/Loading";
import { useInterval } from "../common/useInterval";
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

const REPLAY_STEP = 25;

function augmentData(motorData, program, dataSpec) {
  if (!program) {
    return { motorData, dataSpec };
  }
  try {
    // eslint-disable-next-line no-eval
    const custom = eval("(() => {" + program + "})()");

    return {
      motorData: custom.program.reduce(
        (md, fn) =>
          md.map((datum) => ({
            ...datum,
            ...fn(
              datum,
              md.filter(
                (d) => d.time < datum.time && d.time > datum.time - 30000
              )
            ),
          })),
        motorData
      ),
      dataSpec: [...dataSpec, ...custom.dataSpec],
    };
  } catch (e) {
    console.log("error augmenting", e);
    return { motorData, dataSpec };
  }
}

export const ReplayCharts = ({ windowWidth, file, program }) => {
  const { motorData, dataSpec, loading, error } = useReplayMotorData({
    file,
  });
  const [timestamp, setTimestamp] = useState(45000);
  const [isPlaying, setIsPlaying] = useState(false);

  const augmentedReplayData = useMemo(() => {
    return augmentData(motorData, program, dataSpec);
  }, [motorData, program, dataSpec]);

  useKeys({
    ArrowLeft: () => setTimestamp((ts) => ts - 5000),
    ArrowRight: () => setTimestamp((ts) => ts + 5000),
    Space: () => setIsPlaying((p) => !p),
  });

  useInterval(
    () => setTimestamp((t) => t + REPLAY_STEP),
    isPlaying ? REPLAY_STEP : null
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <ReplayChartsWrapper>
      <ChartPanel
        motorData={augmentedReplayData.motorData.filter(
          (d) => (d.time > timestamp - 60000) & (d.time <= timestamp)
        )}
        dataSpec={augmentedReplayData.dataSpec}
        width={windowWidth}
        useElapsedXAxis={true}
      />
      <Controls>
        <input
          style={{ flex: 1 }}
          type="range"
          min={augmentedReplayData.motorData[0].time}
          max={
            augmentedReplayData.motorData[
              augmentedReplayData.motorData.length - 1
            ].time
          }
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
