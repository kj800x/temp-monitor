import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Route, Switch } from "react-router-dom";
import { RootRoute } from "../root-route/RootRoute";
import { ReplayRoute } from "../replay-route/ReplayRoute";
import { ReplayIndexRoute } from "../replay-index-route/ReplayIndexRoute";
import { Header } from "../common/Header";

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: ${({ overflow }) => overflow};
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

  return (
    <AppWrapper>
      <Header editable={editable} setEditable={setEditable} />
      <Switch>
        <Route path="/replay/:file" exact={true}>
          <Main overflow={"hidden"}>
            <ReplayRoute editable={editable} windowWidth={windowWidth} />
          </Main>
        </Route>
        <Route path="/replay" exact={true}>
          <Main overflow={"auto"}>
            <ReplayIndexRoute />
          </Main>
        </Route>
        <Route path="/">
          <Main overflow={"hidden"}>
            <RootRoute editable={editable} windowWidth={windowWidth} />
          </Main>
        </Route>
      </Switch>
    </AppWrapper>
  );
}

export default App;
