import React, { useState } from "react";
import styled from "styled-components";
import { Route, Switch } from "react-router-dom";
import { RootRoute } from "../root-route/RootRoute";
import { ReplayRoute } from "../replay-route/ReplayRoute";
import { ReplayIndexRoute } from "../replay-index-route/ReplayIndexRoute";
import { Header } from "../common/Header";

const Main = styled.div``;
const AppWrapper = styled.div``;

function App() {
  const [editable, setEditable] = useState(false);

  return (
    <AppWrapper>
      <Header editable={editable} setEditable={setEditable} />
      <Switch>
        <Route path="/replay/:file" exact={true}>
          <Main overflow={"hidden"}>
            <ReplayRoute editable={editable} />
          </Main>
        </Route>
        <Route path="/replay" exact={true}>
          <Main overflow={"auto"}>
            <ReplayIndexRoute />
          </Main>
        </Route>
        <Route path="/">
          <Main>
            <RootRoute editable={editable} />
          </Main>
        </Route>
      </Switch>
    </AppWrapper>
  );
}

export default App;
