import { useQuery } from "@apollo/react-hooks";
import { useState, useEffect } from "react";
import { FETCH_CURRENT_HISTORICAL_DATA } from "../queries";

const WEBSOCKET_ADDRESS = `${
  window.location.protocol === "https:" ? "wss" : "ws"
}://${window.location.hostname}${
  window.location.port ? ":" + window.location.port : ""
}/temp/api`;

const dataSpec = [
  {
    chart: "temperature",
    key: "temperature",
    color: "#82ca9d",
  },
];

export const useMotorData = () => {
  const [motorData, setMotorData] = useState([]);
  const [longMotorData, setLongMotorData] = useState([]);
  const [ws, setWs] = useState(null);

  useQuery(FETCH_CURRENT_HISTORICAL_DATA, {
    onCompleted: (data) => {
      setMotorData((historicalMotorData) => [
        ...data.currentHistoricalData.map((d) => d.data),
        ...historicalMotorData,
      ]);
      setLongMotorData((historicalMotorData) => [
        ...data.currentHistoricalData.map((d) => d.data),
        ...historicalMotorData,
      ]);
    },
  });

  useEffect(() => {
    const lws = new WebSocket(WEBSOCKET_ADDRESS);

    lws.onmessage = (message) => {
      const now = new Date().getTime();
      const shortRetentionThreshold = now - 1000 * 60 * 60;
      const longRetentionThreshold = now - 1000 * 60 * 60 * 24;
      setMotorData((historicalMotorData) => [
        ...historicalMotorData.filter((d) => d.time > shortRetentionThreshold),
        JSON.parse(message.data).state,
      ]);
      setLongMotorData((historicalMotorData) => [
        ...historicalMotorData.filter((d) => d.time > longRetentionThreshold),
        JSON.parse(message.data).state,
      ]);
    };
    setWs(lws);

    return () => {
      lws.close();
      setWs(null);
    };
  }, []);

  console.log({ motorData, longMotorData });

  return {
    motorData,
    dataSpec,
    longMotorData,
    setTarget: (value) => {
      ws && ws.send(JSON.stringify({ type: "set", name: "target", value }));
    },
    setLimit: (value) => {
      ws && ws.send(JSON.stringify({ type: "set", name: "limit", value }));
    },
  };
};
