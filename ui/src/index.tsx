import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

const url = new URL(window.location.href);

const httpUri = `${url.protocol}//${url.host}${
  url.port ? `:${url.port}` : ""
}/temp/graphql`;
const wsUri = `${url.protocol === "https:" ? "wss:" : "ws:"}//${url.host}${
  url.port ? `:${url.port}` : ""
}/temp/graphql`;

// Create an http link:
const httpLink = new HttpLink({
  uri: httpUri,
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true,
  },
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
