import "./logSetup";
import express from "express";
import http from "http";
import path from "path";
import process from "process";
import * as localproxy from "@kj800x/localproxy-client";
import { apolloServer } from "./schema";

import log from "loglevel";
import chalk from "chalk";

async function main() {
  const PORT = await localproxy.getAvailablePort();
  const expressApp = express();
  const httpServer = http.createServer(expressApp);

  const localproxyConfig: localproxy.LocalproxyApp = {
    id: "temp-station",
    name: "Temperature Station",
    pid: process.pid,
    routes: [
      {
        static: true,
        route: "/temp",
        staticDir: path.resolve(__dirname, "../../ui/build/"),
        rootIndexFallback: true,
        priority: 0,
        type: "ui",
        dirListings: false,
      },
      {
        static: false,
        route: "/temp/graphql",
        hostname: "localhost",
        port: PORT,
        trimRoute: false,
        priority: 0,
        type: "api",
      },
    ],
  };

  apolloServer.applyMiddleware({
    app: expressApp,
    path: "/temp/graphql",
  });
  apolloServer.installSubscriptionHandlers(httpServer);

  const runningHttpServer = httpServer.listen(PORT, async () => {
    localproxy.register(localproxyConfig);

    setTimeout(async () => {
      log.info(
        `🚀 Server at ${chalk.cyan(
          `http://localhost:${PORT}${apolloServer.graphqlPath}`
        )}`
      );
      log.info(
        `🚀 Subscriptions at ${chalk.cyan(
          `ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
        )}`
      );
    }, 100);
  });

  process.on("SIGINT", () => {
    localproxy.deregister(localproxyConfig);
    runningHttpServer.close();
    process.exit(0);
  });
}

main().catch(log.error);
