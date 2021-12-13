import fs from "fs";
import process from "process";
import fetch from "cross-fetch";
import {
  ApolloClient,
  gql,
  NormalizedCacheObject,
  InMemoryCache,
  HttpLink,
} from "@apollo/client/core";

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
  mutation record($temperature: Float!, $date: Date!) {
    record(temperature: $temperature, date: $date) {
      id
    }
  }
`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function setup(): Promise<string> {
  const files = fs.readdirSync("/sys/bus/w1/devices/");
  const device = files.find((file) => file.startsWith("28"));
  return `/sys/bus/w1/devices/${device}/w1_slave`;
}

function readTemperature(file: string) {
  const contents = fs.readFileSync(file, "utf-8");
  const number = parseInt(contents.split("t=")[1]!.trim(), 10);
  const c = number / 1000.0;
  const f = (c * 9.0) / 5.0 + 32.0;
  return { c, f };
}

async function main() {
  console.log("Started");
  const file = await setup();

  while (true) {
    const temperature = readTemperature(file);

    await client.mutate({
      mutation: record,
      variables: {
        temperature: temperature.f,
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
