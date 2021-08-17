import React from "react";
import { ChartPanel } from "../common/ChartPanel";

import styled from "styled-components";

const EmptyStateWrapper = styled.div`
  padding: 4px;
  width: 100%;
  text-align: center;
  font-size: 32px;
  margin-top: 24px;
  font-style: italic;
`;

export const ReplayCharts = ({ data }) => {
  if (data.length === 0) {
    return <EmptyStateWrapper>No Data</EmptyStateWrapper>;
  }

  return (
    <ChartPanel
      shortData={data}
      longData={data}
      isReplay={true}
      latestState={data[data.length - 1]}
    />
  );
};
