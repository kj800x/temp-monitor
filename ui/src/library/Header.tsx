import styled from "styled-components";
import { Button } from "./Button";
import { CurrentTemperature } from "../features/CurrentTemperature";
import { useAppState } from "./hooks/useAppState";
import { startOfDate } from "../features/useChartData";
import { NavLink } from "react-router-dom";

const HeaderWrapper = styled.div`
  padding: 8px;
  background: #2d3e50;
  color: #f5f8fa;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 3px solid #cbd6e2;

  & > span {
    display: flex;
    flex-direction: row;
  }
`;

const Title = styled.span`
  font-weight: 700;
  font-size: 24px;
  margin-right: 12px;
`;

const DateInput = styled.input`
  margin-left: 8px;
`;

const NavTab = styled(NavLink)`
  margin-left: 15px;
  font-style: normal;
  font-weight: 600;
  border-top: 1px solid #f5f8fa;
  border-right: 1px solid #f5f8fa;
  border-left: 1px solid #f5f8fa;
  border-image: initial;
  padding: 6px;
  border-bottom: none;
  position: relative;
  bottom: -8px;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  background: #2d3e50;

  color: #f5f8fa !important;
  text-decoration: none !important;

  &.active {
    bottom: -8px;
    margin-bottom: -3px;
    background: #425b76;
  }
`;

const TZ_OFFSET = new Date().getTimezoneOffset() * 60 * 1000;
const pad = (s: any) => (`${s}`.length === 1 ? `0${s}` : `${s}`);

const not = (x: boolean) => !x;

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
};

export const Header = ({ referenceDateEnabled = true }) => {
  const [inMetric, setInMetric] = useAppState<boolean>("useMetric", false);
  const [referenceDate, setReferenceDate] = useAppState<null | number>(
    "referenceDate",
    null
  );

  return (
    <HeaderWrapper>
      <span>
        <Title>
          Office Temperature: <CurrentTemperature inMetric={inMetric} />
        </Title>
        <NavTab to="/" exact={true}>
          Home
        </NavTab>
        <NavTab to="/week">Week</NavTab>
        <NavTab to="/high-low">Highs / Lows</NavTab>
      </span>
      <span>
        {referenceDateEnabled && (
          <Button as="label">
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
        )}
        <Button onClick={() => setInMetric(not)}>
          &deg;C <input type="checkbox" checked={inMetric} readOnly={true} />
        </Button>
      </span>
    </HeaderWrapper>
  );
};
