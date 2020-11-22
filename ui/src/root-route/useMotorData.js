import { useState, useEffect } from "react";

const DUMMY_MOTOR_DATA = {
  time: 0,
  isDummy: true,
  pressure: 0,
  target: 0,
  limit: 0,
  motor: 0,
};

const WEBSOCKET_ADDRESS = `${
  window.location.protocol === "https:" ? "wss" : "ws"
}://${window.location.hostname}${
  window.location.port ? ":" + window.location.port : ""
}/motor/api`;

const dataSpec = [
  {
    chart: "motor",
    key: "target",
    color: "#82ca9d",
  },
  {
    chart: "motor",
    key: "motor",
    color: "#ffff00",
  },
  {
    chart: "pressure",
    key: "pressure",
    color: "#8884d8",
  },
  {
    chart: "pressure",
    key: "avg",
    color: "#00ffff",
  },
  {
    chart: "status",
    key: "limit",
    color: "#00ffff",
  },
  {
    chart: "status",
    key: "status",
    color: "#ff0000",
  },
];

export const useMotorData = () => {
  const [motorData, setMotorData] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const lws = new WebSocket(WEBSOCKET_ADDRESS);

    lws.onmessage = (message) => {
      const now = new Date().getTime();
      const retentionThreshold = now - 60000;
      setMotorData((historicalMotorData) => [
        ...historicalMotorData.filter((d) => d.time > retentionThreshold),
        JSON.parse(message.data).state,
      ]);
    };
    setWs(lws);

    return () => {
      lws.close();
      setWs(null);
    };
  }, []);

  return {
    motorData,
    dataSpec,
    setTarget: (value) => {
      console.log(value);
      ws && ws.send(JSON.stringify({ type: "set", name: "target", value }));
    },
    setLimit: (value) => {
      console.log(value);
      ws && ws.send(JSON.stringify({ type: "set", name: "limit", value }));
    },
  };
};
