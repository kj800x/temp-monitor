import React from "react";

import styled from "styled-components";

const ErrorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ErrorInnerContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ErrorBox = styled.div`
  border: 1px solid #966100;
  width: 50%;
  margin-top: 24px;
`;

const ErrorBoxHeader = styled.div`
  border-bottom: 1px solid #966100;
  background: black;
  text-align: center;
  padding: 8px;
`;

const ErrorBoxContent = styled.div`
  background: rgb(3 28 53);
  padding: 24px;
`;

export default function Error({ error }) {
  return (
    <ErrorContainer>
      <ErrorInnerContainer>
        <h2>Sorry, there was an error.</h2>
        <ErrorBox>
          <ErrorBoxHeader>Maybe this helps?</ErrorBoxHeader>
          <ErrorBoxContent>
            <pre>{error.toString()}</pre>
          </ErrorBoxContent>
        </ErrorBox>
      </ErrorInnerContainer>
    </ErrorContainer>
  );
}
