import { FC } from "react";
import styled from "styled-components";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
  color: #f5f8fa;
`;
const ErrorBox = styled.div`
  border: 3px solid #b65353;
  background: #632121;
  width: 50%;
`;
const ErrorBoxHeader = styled.div`
  border-bottom: 2px solid #b65353;
  background: #360000;
  text-align: center;
  padding: 8px;
  font-weight: 700;
`;
const ErrorBoxContent = styled.pre`
  padding: 24px;
  margin: 0;
  text-wrap: wrap;
  white-space: pre-line;
`;

export const ErrorDisplay: FC<{ error: Error }> = ({ error }) => (
  <ErrorContainer>
    <h2>Something went wrong</h2>
    <ErrorBox>
      <ErrorBoxHeader>Guru Meditation</ErrorBoxHeader>
      <ErrorBoxContent>{error.toString()}</ErrorBoxContent>
    </ErrorBox>
  </ErrorContainer>
);
