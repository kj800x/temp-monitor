import { useEffect, useState } from "react";
import csv from "csv/lib/es5/sync";

function parseData(data) {
  const parsedRawData = data
    .map((row) => row.map(parseFloat))
    .map(([timestamp, temperature]) => ({
      timestamp,
      temperature,
    }));
  const firstTimestamp = parsedRawData[0].timestamp;
  return parsedRawData.map(({ timestamp, temperature }) => ({
    time: timestamp - firstTimestamp,
    temperature,
  }));
}

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

export const useReplayMotorData = ({ file }) => {
  const [motorData, setMotorData] = useState(null);
  // const [dataSpec, setDataSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const request = await fetch(`/temp/logs/${file}`);

        const data = csv.parse(await request.text());
        setMotorData(parseData(data));
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    }
    fetchData();
  }, [file]);

  return {
    motorData,
    dataSpec,
    loading,
    error,
  };
};
