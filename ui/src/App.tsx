import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";

import { Header } from "./library/Header";
import { HomePage } from "./pages/home/HomePage";

const Wrapper = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const AppRouter = () => {
  return (
    <Switch>
      <Route exact path={`/`} component={HomePage} />
    </Switch>
  );
};

export function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Wrapper>
        <Header />
        <AppRouter />
      </Wrapper>
    </Router>
  );
}
