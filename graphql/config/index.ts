import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/link-context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

const BASE_URL = "https://dev-api.fidarri.com/graphql";
const BASE_URL_WS = "wss://dev-api.fidarri.com/graphql";

const wsLink = new WebSocketLink({
  uri: BASE_URL_WS,
  options: {
    reconnect: true,
  },
});

const httpLink = createHttpLink({
  uri: BASE_URL,
});

const authLink: ApolloLink = setContext((_, context) => {
  const { accessToken, deviceToken } = context;

  return {
    headers: {
      ...context.headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
      deviceToken: deviceToken ?? null,
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
    },
  };
});

const splitLink = split(
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
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
});

export default client;
