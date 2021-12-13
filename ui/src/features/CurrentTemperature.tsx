import { FC } from "react";
import { useTitle } from "../library/hooks/useTitle";
import { useCurrentTemperature } from "./useCurrentTemperature";

export const fToC = (f: number) => (f - 32) * (5 / 9);

export const CurrentTemperature: FC<{ inMetric: boolean }> = ({ inMetric }) => {
  const temp = useCurrentTemperature();

  useTitle(
    `${temp ? (inMetric ? fToC(temp).toFixed(1) : temp.toFixed(1)) : "?"} °${
      inMetric ? "C" : "F"
    }`
  );

  if (!temp) {
    return null;
  }

  if (inMetric) {
    return <span>{fToC(temp).toFixed(1)} &deg;C</span>;
  }

  return <span>{temp.toFixed(1)} &deg;F</span>;
};
