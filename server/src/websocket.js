import ws from "ws";

export const wss = new ws.Server({ noServer: true });

export function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(data);
    }
  });
}
