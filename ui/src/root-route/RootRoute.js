import React from "react";

import { useMotorData } from "./useMotorData";
import { ChartPanel } from "../common/ChartPanel";
import { Loading } from "../common/Loading";

export const RootRoute = () => {
  const { motorData, longMotorData, dataSpec, loading } = useMotorData();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <ChartPanel
        motorData={motorData}
        longMotorData={longMotorData}
        dataSpec={dataSpec}
      />
    </>
  );
};
