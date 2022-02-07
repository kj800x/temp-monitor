import { FC } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import styled from "styled-components";
import { fToC } from "../../features/CurrentTemperature";
import { HighLowsQuery } from "../../generated/graphql";
import { useAppState } from "../../library/hooks/useAppState";

const SIGMOID_K = 0.25;
export function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z / SIGMOID_K));
}

function stats(array: number[]): { mean: number; stdev: number } {
  const n = array.length;
  if (!array || array.length === 0) {
    return { mean: 0, stdev: 0 };
  }
  const mean = array.reduce((a, b) => a + b) / n;
  return {
    mean,
    stdev: Math.sqrt(
      array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
    ),
  };
}

const Wrapper = styled.div`
  max-width: 1000px;

  min-height: 100px;

  svg {
    height: 80%;
    width: 80%;
  }

  h1 {
    text-align: center;
  }

  margin: 12px auto;

  .color-dark-hot-empty {
    fill: #161b22;
  }
  .color-dark-hot-1 {
    fill: #460d0d;
  }
  .color-dark-hot-2 {
    fill: #8d2929;
  }
  .color-dark-hot-3 {
    fill: #bb3939;
  }
  .color-dark-hot-4 {
    fill: #ff4c4c;
  }

  .color-dark-cold-empty {
    fill: #161b22;
  }
  .color-dark-cold-1 {
    fill: #001174;
  }
  .color-dark-cold-2 {
    fill: #031895;
  }
  .color-dark-cold-3 {
    fill: #0b25bf;
  }
  .color-dark-cold-4 {
    fill: #1033ff;
  }

  .color-dark-humidity-empty {
    fill: #161b22;
  }
  .color-dark-humidity-1 {
    fill: #0e4429;
  }
  .color-dark-humidity-2 {
    fill: #006d32;
  }
  .color-dark-humidity-3 {
    fill: #26a641;
  }
  .color-dark-humidity-4 {
    fill: #39d353;
  }
`;

export const GitHubChart: FC<{
  data: HighLowsQuery["highLows"];
  dataKey: keyof Omit<HighLowsQuery["highLows"][0], "date" | "__typename">;
  type: "temperature" | "humidity";
  theme: "hot" | "cold" | "humidity";
  title: string;
}> = ({ data, dataKey, type, theme, title }) => {
  const [inMetric] = useAppState<boolean>("useMetric", false);

  const { mean, stdev } = stats(
    data.map((datum) => datum[dataKey] || 0).filter((n) => n !== 0)
  );

  const values = data.map((datum) => ({
    date: datum.date,
    count: datum[dataKey],
  }));

  return (
    <Wrapper>
      <h1>{title}</h1>
      <CalendarHeatmap
        startDate={data[0].date}
        endDate={data[data.length - 1].date}
        values={values}
        gutterSize={2}
        titleForValue={(value) => {
          if (!value || value.count === 0 || value.count == null) {
            return `No data for ${
              value
                ? new Date(value.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                : "missing date"
            }`;
          } else {
            return `${(inMetric && type === "temperature"
              ? fToC(value.count)
              : value.count
            ).toFixed(1)}${
              type === "humidity" ? "%" : ` °${inMetric ? "C" : "F"}`
            } on ${new Date(value.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}`;
          }
        }}
        classForValue={(value) => {
          if (!value || value.count === 0 || value.count == null) {
            return `color-dark-${theme}-empty`;
          }

          const z = (value.count - mean) / (stdev + 0.001); // add tiny amount to stdev to prevent division by 0
          const level = sigmoid(z);

          return `color-dark-${theme}-${Math.round(level * 3) + 1}`;
        }}
      />
    </Wrapper>
  );
};
