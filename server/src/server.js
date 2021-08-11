import express from "express";
import http from "http";
import path from "path";
import process from "process";
import * as localproxy from "@kj800x/localproxy-client";

import { wss } from "./websocket";
import { apolloServer } from "./schema";

async function main() {
  const PORT = await localproxy.getAvailablePort();
  const DIRECT_WS_API_PORT = await localproxy.getAvailablePort();

  const expressApp = express();
  const httpServer = http.createServer(expressApp);
  const expressWsApp = express();
  const httpWsServer = http.createServer(expressWsApp);

  apolloServer.applyMiddleware({
    app: expressApp,
    path: "/temp/graphql",
  });
  apolloServer.installSubscriptionHandlers(httpServer);

  const runningHttpWsServer = httpWsServer.listen(
    DIRECT_WS_API_PORT,
    async () => {
      console.log(
        `🚀 Websocket Direct API server ready at ws://localhost/temp/api (proxy to ws://localhost:${DIRECT_WS_API_PORT})`
      );
    }
  );
  runningHttpWsServer.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (socket) => {
      wss.emit("connection", socket, request);
    });
  });

  const localproxyConfig = {
    id: "temperature logger",
    name: "Temperature Logger",
    pid: process.pid,
    routes: [
      {
        static: true,
        route: "/temp",
        staticDir: path.resolve(__dirname, "../../ui/build/"),
        rootIndexFallback: true,
        priority: 0,
        type: "ui",
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
      {
        static: false,
        route: "/temp/api",
        hostname: "localhost",
        port: DIRECT_WS_API_PORT,
        trimRoute: false,
        priority: 0,
        type: "api",
      },
      {
        static: true,
        route: "/temp/logs",
        staticDir: path.resolve(__dirname, "../logs"),
        dirListings: true,
        priority: 0,
        type: "data",
      },
    ],
  };

  const runningHttpServer = httpServer.listen(PORT, async () => {
    console.log(
      `🚀 HTTP server ready at http://localhost/temp and http://localhost/temp/graphql (proxy to http://localhost:${PORT})`
    );
    localproxy.register(localproxyConfig);
  });

  process.on("SIGINT", () => {
    localproxy.deregister(localproxyConfig);
    runningHttpServer.close();
    runningHttpWsServer.close();
    process.exit(0);
  });
}

main().catch(console.error);
