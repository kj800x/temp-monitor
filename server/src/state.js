import { broadcast } from "./websocket";

function broadcastState() {
  broadcast(Math.random());
}

setInterval(broadcastState, 100);
