import { useQuery } from "@apollo/react-hooks";
import { useState, useEffect } from "react";
import { FETCH_CURRENT_HISTORICAL_DATA } from "../queries";
import { groomLongStates, groomShortStates } from "../common/groom";
import { Queue } from "../common/queue";

const WEBSOCKET_ADDRESS = `${
  window.location.protocol === "https:" ? "wss" : "ws"
}://${window.location.hostname}${
  window.location.port ? ":" + window.location.port : ""
}/temp/api`;

export const useData = () => {
  const [shortQueue] = useState(() => new Queue());
  const [longQueue] = useState(() => new Queue());
  const [shortData, setShortData] = useState([]);
  const [longData, setLongData] = useState([]);
  const [latestState, setLatestState] = useState(null);

  const { loading } = useQuery(FETCH_CURRENT_HISTORICAL_DATA, {
    onCompleted: (data) => {
      const incomingShortData =
        data.currentHistoricalData.shortHistoricalStates.map((d) => d.data);
      const incomingLongData =
        data.currentHistoricalData.longHistoricalStates.map((d) => d.data);

      groomShortStates(shortQueue, incomingShortData);
      groomLongStates(longQueue, incomingLongData);
      setShortData(shortQueue.toArray());
      setLongData(longQueue.toArray());
      setLatestState(incomingShortData[incomingShortData.length - 1]);
    },
  });

  useEffect(() => {
    if (!loading) {
      const ws = new WebSocket(WEBSOCKET_ADDRESS);

      ws.onmessage = (message) => {
        const state = JSON.parse(message.data).state;
        groomShortStates(shortQueue, [state]);
        groomLongStates(longQueue, [state]);
        setShortData(shortQueue.toArray());
        setLongData(longQueue.toArray());
        setLatestState(state);
      };

      return () => {
        ws.close();
      };
    }
  }, [longQueue, shortQueue, loading]);

  return {
    loading,
    shortData,
    longData,
    latestState,
  };
};
