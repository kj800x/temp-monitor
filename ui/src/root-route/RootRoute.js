import React from "react";

import { useMotorData } from "./useMotorData";
import { ChartPanel } from "../common/ChartPanel";
import { ControlPanel } from "./ControlPanel";

export const RootRoute = ({ editable, windowWidth }) => {
  const { motorData, dataSpec, setTarget, setLimit } = useMotorData();

  return (
    <>
      <ChartPanel
        motorData={motorData}
        dataSpec={dataSpec}
        width={editable ? windowWidth - 200 : windowWidth}
      />
      {editable && (
        <ControlPanel
          latestMotorData={motorData[motorData.length - 1]}
          setTarget={setTarget}
          setLimit={setLimit}
        />
      )}
    </>
  );
};
