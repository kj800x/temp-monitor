import React from "react";
import styled from "styled-components";
import { Route, Switch } from "react-router-dom";
import { RootRoute } from "../root-route/RootRoute";
import { ReplayRoute } from "../replay-route/ReplayRoute";
import { ReplayIndexRoute } from "../replay-index-route/ReplayIndexRoute";
import { Header } from "../common/Header";

const Main = styled.div``;
const AppWrapper = styled.div``;

function App() {
  return (
    <AppWrapper>
      <Header />
      <Switch>
        <Route path="/replay/:date" exact={true}>
          <Main>
            <ReplayRoute />
          </Main>
        </Route>
        <Route path="/replay" exact={true}>
          <Main>
            <ReplayIndexRoute />
          </Main>
        </Route>
        <Route path="/">
          <Main>
            <RootRoute />
          </Main>
        </Route>
      </Switch>
    </AppWrapper>
  );
}

export default App;
