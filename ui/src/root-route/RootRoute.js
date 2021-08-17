import React from "react";

import { useData } from "./useData";
import { ChartPanel } from "../common/ChartPanel";
import { Loading } from "../common/Loading";

export const RootRoute = () => {
  const { shortData, longData, latestState, loading } = useData();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <ChartPanel
        shortData={shortData}
        longData={longData}
        latestState={latestState}
      />
    </>
  );
};
