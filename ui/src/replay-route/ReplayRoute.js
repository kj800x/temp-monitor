import React from "react";

import { useHistory, useParams } from "react-router-dom";
import { ErrorDisplay } from "../common/ErrorDisplay";
import { ONE_DAY_IN_MS, ONE_HOUR_IN_MS } from "../common/groom";
import { Loading } from "../common/Loading";
import { ReplayCharts } from "./ReplayCharts";
import { useReplayData } from "./useReplayData";
import { useKeys } from "../common/useKeys";
import styled from "styled-components";
import { FETCH_FIRST_DATE_AVAILABLE } from "../queries";
import { useQuery } from "@apollo/react-hooks";

const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);

const DateWrapper = styled.div`
  padding: 4px;
  width: 100%;
  text-align: center;
  font-size: 48px;
  margin-top: 24px;
`;

const DateFor = ({ date }) => {
  return (
    <DateWrapper>
      {new Date(date - ONE_HOUR_IN_MS).toLocaleDateString("en-US", {
        weekday: isMobileDevice ? "short" : "long",
        month: isMobileDevice ? "short" : "long",
        day: "numeric",
      })}
    </DateWrapper>
  );
};

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 12px;
`;
const Button = styled.button`
  background: white;
  border: 1px solid black;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: large;
  background: lightblue;
  font-weight: 600;

  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};

  &:active {
    background: #4fa1bb;
  }
`;

const Controls = ({ date, canGoBack, canGoForward }) => {
  const history = useHistory();

  return (
    <ControlsWrapper>
      <Button
        visible={canGoBack}
        onClick={() => {
          history.push(`/replay/${date - ONE_DAY_IN_MS}`);
        }}
      >
        Previous
      </Button>
      <Button
        visible={canGoForward}
        onClick={() => {
          history.push(`/replay/${parseInt(date, 10) + ONE_DAY_IN_MS}`);
        }}
      >
        Next
      </Button>
    </ControlsWrapper>
  );
};

export const ReplayRoute = () => {
  const { date } = useParams();
  const history = useHistory();

  const { data, loading, error } = useReplayData(parseInt(date, 10));
  const {
    data: firstDateData,
    loading: firstDateLoading,
    error: firstDateError,
  } = useQuery(FETCH_FIRST_DATE_AVAILABLE);

  const canGoBack =
    firstDateData.firstDateAvailable < parseInt(date, 10) - ONE_DAY_IN_MS;
  const canGoForward = parseInt(date, 10) < new Date().getTime();

  useKeys(
    {
      ArrowLeft: () => {
        if (canGoBack) {
          history.push(`/replay/${parseInt(date, 10) - ONE_DAY_IN_MS}`);
        }
      },
      ArrowRight: () => {
        if (canGoForward) {
          history.push(`/replay/${parseInt(date, 10) + ONE_DAY_IN_MS}`);
        }
      },
    },
    [canGoBack, canGoForward]
  );

  if (loading || firstDateLoading) {
    return <Loading />;
  }

  if (error || firstDateError) {
    return <ErrorDisplay error={error || firstDateError} />;
  }

  return (
    <>
      <DateFor date={parseInt(date, 10)} />
      <ReplayCharts data={data} />
      <Controls
        date={parseInt(date, 10)}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />
    </>
  );
};
