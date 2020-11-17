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
    path: "/motor/graphql",
  });
  apolloServer.installSubscriptionHandlers(httpServer);

  const runningHttpWsServer = httpWsServer.listen(DIRECT_WS_API_PORT, async () => {
    console.log(
      `🚀 Websocket Direct API server ready at http://localhost/motor/api (proxy to http://localhost:${DIRECT_WS_API_PORT})`
    );
  })
  runningHttpWsServer.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (socket) => {
      wss.emit("connection", socket, request);
    });
  });

  const localproxyConfig = {
    id: "motor-controller",
    name: "Motor Controller",
    pid: process.pid,
    routes: [
      {
        static: true,
        route: "/motor",
        staticDir: path.resolve(__dirname, "../../ui/build/"),
        indexFallback: true,
        priority: 0,
        type: "ui",
      },
      {
        static: false,
        route: "/motor/graphql",
        hostname: "localhost",
        port: PORT,
        trimRoute: false,
        priority: 0,
        type: "api",
      },
      {
        static: false,
        route: "/motor/api",
        hostname: "localhost",
        port: DIRECT_WS_API_PORT,
        trimRoute: false,
        priority: 0,
        type: "api",
      },
    ],
  };

  const runningHttpServer = httpServer.listen(PORT, async () => {
    console.log(
      `🚀 Default server ready at http://localhost/motor and http://localhost/motor/graphql (proxy to http://localhost:${PORT})`
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
