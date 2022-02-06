import process from "process";
import fetch from "cross-fetch";
import {
  ApolloClient,
  gql,
  NormalizedCacheObject,
  InMemoryCache,
  HttpLink,
} from "@apollo/client/core";
import sensor from "node-dht-sensor";
import fs from "fs";
import path from "path";

const ONE_MINUTE = 1000 * 60;
const AUTH_FILE_PATH = path.join(__dirname, "..", "auth.txt");

if (!fs.existsSync(AUTH_FILE_PATH)) {
  throw new Error(
    `Unable to read JWT token from ${AUTH_FILE_PATH}. You must generate a token with "bend cli generate-token" on the server and then create an auth.txt file on this device with the result`
  );
}

const auth = fs.readFileSync(AUTH_FILE_PATH, "utf-8").trim();

const cache: InMemoryCache = new InMemoryCache({});
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: `https://apps.coolkev.com/temp/graphql`,
    fetch,
    headers: {
      Authorization: auth,
    },
  }),
});

const record = gql`
  mutation record($temperature: Float!, $humidity: Float!, $date: Date!) {
    record(temperature: $temperature, humidity: $humidity, date: $date) {
      id
    }
  }
`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function readTemperature() {
  const values = sensor.read(22, 22);

  const c = values.temperature;
  const f = (c * 9.0) / 5.0 + 32.0;
  return { c, f, humidity: values.humidity };
}

async function main() {
  console.log("Started");
  while (true) {
    const temperature = readTemperature();

    await client.mutate({
      mutation: record,
      variables: {
        temperature: temperature.f,
        humidity: temperature.humidity,
        date: new Date().getTime(),
      },
    });

    await sleep(ONE_MINUTE);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
