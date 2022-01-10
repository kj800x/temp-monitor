import styled from "styled-components";
import { Button } from "./Button";
import { CurrentTemperature } from "../features/CurrentTemperature";
import { useAppState } from "./hooks/useAppState";
import { startOfDate } from "../features/useChartData";

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

const DateInput = styled.input`
  margin-left: 8px;
`;

const TZ_OFFSET = new Date().getTimezoneOffset() * 60 * 1000;
const pad = (s: any) => (`${s}`.length === 1 ? `0${s}` : `${s}`);

const not = (x: boolean) => !x;

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
};

export const Header = () => {
  const [inMetric, setInMetric] = useAppState<boolean>("useMetric", false);
  const [referenceDate, setReferenceDate] = useAppState<null | number>(
    "referenceDate",
    null
  );

  return (
    <HeaderWrapper>
      <Title>
        Office Temperature: <CurrentTemperature inMetric={inMetric} />
      </Title>
      <span>
        <Button>
          Compare to:
          <DateInput
            type="date"
            max={formatDate(startOfDate(-2, new Date()))}
            value={referenceDate ? formatDate(new Date(referenceDate)) : ""}
            onChange={(e) =>
              setReferenceDate(
                startOfDate(
                  0,
                  new Date(new Date(e.target.value).getTime() + TZ_OFFSET)
                ).getTime()
              )
            }
          />
        </Button>
        <Button onClick={() => setInMetric(not)}>
          &deg;C <input type="checkbox" checked={inMetric} readOnly={true} />
        </Button>
      </span>
    </HeaderWrapper>
  );
};
