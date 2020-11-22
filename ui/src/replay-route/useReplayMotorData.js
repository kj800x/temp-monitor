import { useEffect, useState } from "react";
import csv from "csv/lib/es5/sync";

function parseData(data) {
  const parsedRawData = data
    .map((row) => row.map(parseFloat))
    .map(([timestamp, pressure, status, motor, target, limit]) => ({
      timestamp,
      pressure,
      status,
      motor,
      target,
      limit,
    }));
  const firstTimestamp = parsedRawData[0].timestamp;
  return parsedRawData.map(
    ({ timestamp, pressure, status, motor, target, limit }) => ({
      time: timestamp - firstTimestamp,
      pressure,
      status,
      motor,
      target,
      limit,
    })
  );
}

export const useReplayMotorData = ({ file }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const request = await fetch(`/motor/logs/${file}`);

        const data = csv.parse(await request.text());
        setData(parseData(data));
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    }
    fetchData();
  }, [file]);

  return {
    historicalMotorData: data,
    loading,
    error,
  };
};
