import React from "react";
import styled from "styled-components";

const ControlPanelWrapper = styled.div`
  padding: 4px;
  border-left: 1px solid black;
  width: 200px;
  display: flex;
  flex-direction: row;
`;

const SliderContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const SliderLabel = styled.div``;
const Slider = styled.input`
  flex: 1;
`;

export const ControlPanel = ({ currentMotorData, setTarget, setLimit }) => (
  <ControlPanelWrapper>
    <SliderContainer>
      <Slider
        type="range"
        orient="vertical"
        min="0"
        max="1"
        value={currentMotorData.target}
        step="0.01"
        onChange={({ target: { value } }) => setTarget(parseFloat(value))}
      />
      <SliderLabel>Target</SliderLabel>
    </SliderContainer>
    <SliderContainer>
      <Slider
        type="range"
        orient="vertical"
        min="0"
        max="1"
        value={currentMotorData.limit}
        step="0.01"
        onChange={({ target: { value } }) => setLimit(parseFloat(value))}
      />
      <SliderLabel>Limit</SliderLabel>
    </SliderContainer>
  </ControlPanelWrapper>
);
