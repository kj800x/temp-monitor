import express from "express";
import http from "http";
import path from "path";
import { wss } from "./websocket";
import * as localproxy from "@kj800x/localproxy-client";
import "./state";

async function main() {
  const PORT = await localproxy.getAvailablePort();

  const expressApp = express();
  const httpServer = http.createServer(expressApp);

  const localproxyConfig = {
    id: "motor-controller",
    name: "Motor Controller",
    routes: [
      {
        static: true,
        route: "/motor",
        staticDir: path.resolve(__dirname, "../motor-controller-ui/build/"),
        indexFallback: true,
        priority: 0,
        type: "ui",
      },
      {
        static: false,
        route: "/motor/api",
        hostname: "localhost",
        port: PORT,
        trimRoute: false,
        priority: 0,
        type: "api",
      },
    ],
  };

  const runningHttpServer = httpServer.listen(PORT, async () => {
    console.log(
      `🚀 Server ready at http://localhost/motor and http://localhost/motor/api (proxy to http://localhost:${PORT})`
    );
    localproxy.register(localproxyConfig);
  });

  runningHttpServer.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (socket) => {
      wss.emit("connection", socket, request);
    });
  });

  process.on("SIGINT", () => {
    localproxy.deregister(localproxyConfig);
    runningHttpServer.close();
    process.exit(0);
  });
}

main().catch(console.error);
