import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import "./index.css";
import App from "./entry/App";

import { BrowserRouter as Router } from "react-router-dom";
import { client } from "./entry/apollo";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router basename={process.env.PUBLIC_URL}>
        <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
