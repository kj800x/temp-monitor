import React from "react";

import { useMotorData } from "./useMotorData";
import { ChartPanel } from "./ChartPanel";
import { ControlPanel } from "./ControlPanel";

export const RootRoute = ({ editable, windowWidth }) => {
  const {
    historicalMotorData,
    currentMotorData,
    setTarget,
    setLimit,
  } = useMotorData();

  return (
    <>
      <ChartPanel
        historicalMotorData={historicalMotorData}
        currentMotorData={currentMotorData}
        width={editable ? windowWidth - 200 : windowWidth}
      />
      {editable && (
        <ControlPanel
          currentMotorData={currentMotorData}
          setTarget={setTarget}
          setLimit={setLimit}
        />
      )}
    </>
  );
};
