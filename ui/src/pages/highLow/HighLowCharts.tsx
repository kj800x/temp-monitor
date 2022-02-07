import styled from "styled-components";
import { useHighLowsQuery } from "../../generated/graphql";
import { ErrorDisplay } from "../../library/ErrorDisplay";
import { Loading } from "../../library/Loading";
import { GitHubChart } from "./GitHubChart";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
`;

export const HighLowCharts = () => {
  const { data, loading, error } = useHighLowsQuery();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <Wrapper>
      <GitHubChart
        data={data!.highLows}
        dataKey="tempHigh"
        type="temperature"
        theme="hot"
        title="Temperature Highs"
      />
      <GitHubChart
        data={data!.highLows}
        dataKey="tempLow"
        type="temperature"
        theme="cold"
        title="Temperature Lows"
      />
      <GitHubChart
        data={data!.highLows}
        dataKey="humidityHigh"
        type="humidity"
        theme="humidity"
        title="Humidity Highs"
      />
      <GitHubChart
        data={data!.highLows}
        dataKey="humidityLow"
        type="humidity"
        theme="humidity"
        title="Humidity Lows"
      />
    </Wrapper>
  );
};
