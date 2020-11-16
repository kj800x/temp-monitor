import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Route, Switch } from "react-router-dom";
import { RootRoute } from "./RootRoute";
import { ReplayRoute } from "./ReplayRoute";
import { Header } from "./Header";

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

  return (
    <AppWrapper>
      <Header editable={editable} setEditable={setEditable} />
      <Main>
        <Switch>
          <Route path="/replay" exact={true}>
            <ReplayRoute />
          </Route>
          <Route path="/">
            <RootRoute editable={editable} windowWidth={windowWidth} />
          </Route>
        </Switch>
      </Main>
    </AppWrapper>
  );
}

export default App;
