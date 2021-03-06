import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { HomePage } from "./pages/home/HomePage";
import { WeekPage } from "./pages/week/WeekPage";
import { HighLowPage } from "./pages/highLow/HighLowPage";

export function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path={`/`} component={HomePage} />
        <Route exact path={`/week`} component={WeekPage} />
        <Route exact path={`/high-low`} component={HighLowPage} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}
