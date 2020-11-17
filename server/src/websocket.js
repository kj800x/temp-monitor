import ws from "ws";
import { setTarget, setLimit } from "./state";
import { getLogging, setLogging } from "./logger";

export const wss = new ws.Server({ noServer: true });

wss.on("connection", (connection) => {
  connection.on("message", (message) => {
    const json = JSON.parse(message);
    if (json.type === "set") {
      if (json.name === "target") {
        setTarget(json.value);
      }
      if (json.name === "limit") {
        setLimit(json.value);
      }
      if (json.name === "logging") {
        setLogging(json.value);
      }
    }
  });
});

export function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(
        JSON.stringify({
          logging: getLogging(),
          data,
        })
      );
    }
  });
}
