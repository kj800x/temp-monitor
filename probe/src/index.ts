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

const cache: InMemoryCache = new InMemoryCache({});
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: `https://apps.coolkev.com/temp/graphql`,
    fetch,
  }),
});

const record = gql`
  mutation record(
    $apiKey: String!
    $temperature: Float!
    $humidity: Float!
    $date: Date!
  ) {
    record(
      apiKey: $apiKey
      temperature: $temperature
      humidity: $humidity
      date: $date
    ) {
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

function readAPIKey(): string {
  try {
    const envFilePath = path.join(__dirname, "..", "..", ".env");
    const envFile = fs.readFileSync(envFilePath, "utf8");
    return envFile
      .split("\n")
      .find((line) => line.startsWith("API_KEY"))!
      .split("API_KEY=")[1]!
      .trim();
  } catch (error) {
    throw new Error(
      "Unable to read API_KEY from .env file. Have you created one?"
    );
  }
}

async function main() {
  console.log("Started");

  const apiKey = readAPIKey();

  while (true) {
    const temperature = readTemperature();

    await client.mutate({
      mutation: record,
      variables: {
        apiKey,
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
