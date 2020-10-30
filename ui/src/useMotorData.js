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

export const useMotorData = () => {
  const [historicalMotorData, setHistoricalMotorData] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const lws = new WebSocket(WEBSOCKET_ADDRESS);

    lws.onmessage = (message) => {
      const now = new Date().getTime();
      const retentionThreshold = now - 60000;
      setHistoricalMotorData((historicalMotorData) => [
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
    historicalMotorData,
    currentMotorData:
      historicalMotorData.length > 0
        ? historicalMotorData[historicalMotorData.length - 1]
        : DUMMY_MOTOR_DATA,
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
