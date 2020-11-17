import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import introspectionQueryResultData from "./fragmentTypes.json";

const url = new URL(window.location);

// Create an http link:
const httpLink = new HttpLink({
  uri: `${url.protocol}//${url.host}${
    url.port ? `:${url.port}` : ""
  }/motor/graphql`,
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `${url.protocol === "https:" ? "wss:" : "ws:"}//${url.host}${
    url.port ? `:${url.port}` : ""
  }/motor/graphql`,
  options: {
    reconnect: true,
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
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

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const cache = new InMemoryCache({ fragmentMatcher });
export const client = new ApolloClient({
  link,
  cache,
});
