import React from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components";

import { ONE_HOUR_IN_MS } from "../common/groom";
import { FETCH_FIRST_DATE_AVAILABLE } from "../queries";
import { Loading } from "../common/Loading";
import { ErrorDisplay } from "../common/ErrorDisplay";
import { Link } from "react-router-dom";

const CalendarWrapper = styled.div`
  width: 350px;
  margin: auto;
  display: flex;
  flex-direction: column;
`;
const MonthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 12px 0px;
  background: #132875;
  padding: 12px;
`;
const WeekWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  text-align: center;

  & > div {
    width: 57px;
  }
`;
const Spacer = styled.div``;
const DayWrapper = styled.div`
  & > a {
    color: lightblue !important;
    text-decoration: none;
  }
`;

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

function getCalendar(firstDateAvailable) {
  const now = new Date().getTime();
  const dates = [];
  let date = firstDateAvailable;

  while (date < now) {
    if (new Date(date).getDate() === 1) {
      dates.push("NEW_MONTH");
    }
    if (new Date(date).getDay() === 0) {
      dates.push("NEW_WEEK");
    }
    dates.push(date);
    date += DAY;
  }

  return dates;
}

const split = (array, matchElem) => {
  const out = [];
  let current = [];
  for (const e of array) {
    if (e === matchElem) {
      out.push(current);
      current = [];
    } else {
      current.push(e);
    }
  }
  out.push(current);
  return out;
};

export const Day = ({ day }) => {
  const date = new Date(day - ONE_HOUR_IN_MS).getDate();

  return (
    <DayWrapper>
      <Link to={`/replay/${day}`}>{date}</Link>
    </DayWrapper>
  );
};

const oneTo = (i) => {
  if (i <= 0) {
    return [];
  }
  return [...oneTo(i - 1), i];
};

const PreSpacer = ({ day }) => {
  return (
    <>
      {oneTo(day).map((e) => (
        <Spacer key={e} />
      ))}
    </>
  );
};
const PostSpacer = ({ day }) => {
  return (
    <>
      {oneTo(6 - day).map((e) => (
        <Spacer key={e} />
      ))}
    </>
  );
};

export const startOfDay = (d) => {
  const date = new Date(d);
  date.setMilliseconds(0);
  date.setSeconds(0);
  date.setMinutes(0);
  date.setHours(0);
  date.setDate(date.getDate() + 1);
  return date.getTime();
};

export const Week = ({ week }) => {
  return (
    <WeekWrapper>
      <PreSpacer day={new Date(week[0]).getDay()} />
      {week.map((day, i) => (
        <Day day={startOfDay(day)} key={i} />
      ))}
      <PostSpacer day={new Date(week[week.length - 1]).getDay()} />
    </WeekWrapper>
  );
};

export const Month = ({ month }) => {
  return (
    <MonthWrapper>
      <WeekWrapper>
        {new Date(month[0][0]).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })}
      </WeekWrapper>
      {month.map((week, i) => (
        <Week week={week} key={i} />
      ))}
    </MonthWrapper>
  );
};

export const Calendar = ({ calendar }) => {
  return (
    <CalendarWrapper>
      {calendar.map((month, i) => (
        <Month month={month} key={i} />
      ))}
    </CalendarWrapper>
  );
};

export const ReplayIndexRoute = () => {
  const { data, loading, error } = useQuery(FETCH_FIRST_DATE_AVAILABLE);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const days = getCalendar(data.firstDateAvailable);

  const calendar = split(days, "NEW_MONTH").map((m) => split(m, "NEW_WEEK"));

  return <Calendar calendar={calendar} />;
};
