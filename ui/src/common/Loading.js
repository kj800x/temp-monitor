import React /*, { useState, useCallback } */ from "react";
import Loader from "react-loaders";
import styled from "styled-components";
// import { useDelayedEffect } from "./useDelayedEffect";

import "loaders.css/loaders.min.css";

const LoaderContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const LoaderInnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  margin: 20px;

  .ball-grid-pulse > div,
  .ball-spin-fade-loader > div {
    background-color: white;
  }
`;

export function Loading() {
  // const [show, setShow] = useState(false);

  // const activate = useCallback(() => {
  //   setShow(true);
  // }, [setShow]);

  // useDelayedEffect(activate, 100);

  // if (!show) {
  //   return null;
  // }

  return (
    <LoaderContainer>
      <LoaderInnerContainer>
        <Loader type="ball-grid-pulse" />
      </LoaderInnerContainer>
    </LoaderContainer>
  );
}
