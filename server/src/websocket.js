import ws from "ws";
import { recordTemperature } from "./state";
import { setLogging } from "./logger";
import { pubsub } from "./pubsub";

export const wss = new ws.Server({ noServer: true });

wss.on("connection", (connection) => {
  connection.on("message", (message) => {
    const json = JSON.parse(message);
    if (json.type === "record") {
      if (json.name === "temperature") {
        recordTemperature(json.value.f);
      }
    }
    if (json.type === "set") {
      if (json.name === "logging") {
        setLogging(json.value);
      }
    }
  });
});

export function broadcast(data) {
  pubsub.publish("stateUpdate", {
    stateUpdate: { data },
  });
  wss.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}
