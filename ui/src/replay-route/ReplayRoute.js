import React from "react";

import { useParams } from "react-router-dom";
import { ReplayCharts } from "./ReplayCharts";

export const ReplayRoute = ({ windowWidth }) => {
  const { file } = useParams();

  return <ReplayCharts windowWidth={windowWidth} file={file} />;
};
