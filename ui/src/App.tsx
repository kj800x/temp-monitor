import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { HomePage } from "./pages/home/HomePage";
import { WeekPage } from "./pages/week/WeekPage";

export function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path={`/`} component={HomePage} />
        <Route exact path={`/week`} component={WeekPage} />
      </Switch>
    </Router>
  );
}
