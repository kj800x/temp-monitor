import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useMotorData } from "./useMotorData";
import { ChartPanel } from "./ChartPanel";
import { ControlPanel } from "./ControlPanel";

const Header = styled.div`
  padding: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid black;
  background-color: #4f2c09;
`;
const HeaderButton = styled.div`
  cursor: pointer;
  user-select: none;
  border: 1px solid black;
  padding: 4px;
  background: #793d00;
`;
const HeaderTitle = styled.div`
  cursor: auto;
  user-select: none;
  font-size: x-large;
  font-weight: 600;
  font-style: italic;
  color: #ffed00;
`;
const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;
const AppWrapper = styled.div`
  flex-direction: column;
  display: flex;
  height: 100%;
`;

function App() {
  const [editable, setEditable] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handler = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  });

  const {
    historicalMotorData,
    currentMotorData,
    setTarget,
    setLimit,
  } = useMotorData();

  return (
    <AppWrapper>
      <Header>
        <HeaderTitle>Motor Control</HeaderTitle>
        <HeaderButton onClick={() => setEditable(!editable)}>
          Editable
          <input type="checkbox" checked={editable} readOnly={true} />
        </HeaderButton>
      </Header>
      <Main>
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
      </Main>
    </AppWrapper>
  );
}

export default App;
