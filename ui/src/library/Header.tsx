import styled from "styled-components";
import { Button } from "./Button";
import { CurrentTemperature } from "../features/CurrentTemperature";
import { useAppState } from "./hooks/useAppState";

const HeaderWrapper = styled.div`
  padding: 8px;
  background: #2d3e50;
  color: #f5f8fa;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 3px solid #cbd6e2;
`;

const Title = styled.span`
  font-weight: 700;
  font-size: 24px;
`;

const not = (x: boolean) => !x;

export const Header = () => {
  const [inMetric, setInMetric] = useAppState<boolean>("useMetric", false);

  return (
    <HeaderWrapper>
      <Title>
        Office Temperature: <CurrentTemperature inMetric={inMetric} />
      </Title>
      <span>
        <Button onClick={() => setInMetric(not)}>
          &deg;C <input type="checkbox" checked={inMetric} readOnly={true} />
        </Button>
      </span>
    </HeaderWrapper>
  );
};
