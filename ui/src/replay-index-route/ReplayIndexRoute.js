import React from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import TimeAgo from "react-timeago";

import { FETCH_REPLAY_OPTIONS } from "../queries";
import { Link } from "react-router-dom";
import Loading from "../common/Loading";
import Error from "../common/Error";

const FileLink = styled(Link)`
  display: flex;
  flex-direction: column;
  border: 1px solid orange;
  background: #522900;
  padding: 10px;
  height: 50px;
  width: 175px;
  font-size: small;
  margin: 4px;
  color: white;
  text-decoration: none;
  text-align: center;
  justify-content: space-around;
`;

const OptionTitle = styled.h2`
  margin: 12px 4px 8px;
`;

const OptionFiles = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const DATE_OPTIONS = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = WEEK * 4;
const YEAR = MONTH * 12;

const lp = (x) => (("" + x).length === 1 ? "0" + x : x);

function makeDate({ year, month, day, hour, minute, second }) {
  return new Date(
    `${lp(year)}-${lp(month)}-${lp(day)}T${lp(hour)}:${lp(minute)}:${lp(
      second
    )}`
  );
}

function useOptions(data) {
  if (!data) {
    return null;
  }

  const processedData = data.allReplayDataOptions.flatMap((raw) => {
    try {
      const name = raw.split(".")[0];
      const [[year, month, day], [hour, minute, second]] = name
        .split("_")
        .map((part) => part.split("-"));

      return [
        {
          date: makeDate({ year, month, day, hour, minute, second }),
          raw,
        },
      ];
    } catch (e) {
      console.warn("Unparsable date", raw, e);
      return [
        {
          date: new Date(0),
          raw,
          unparseable: true,
        },
      ];
    }
  });

  const unparseableData = processedData.filter((d) => d.unparseable);
  const datedData = processedData.filter((d) => !d.unparseable);

  datedData.sort((b, a) => a.date - b.date);

  const now = new Date();

  const groups = [
    {
      title: "Last Hour",
      files: datedData.filter((d) => d.date > now - HOUR),
    },
    {
      title: "Last Day",
      files: datedData.filter((d) => d.date > now - DAY && d.date < now - HOUR),
    },
    {
      title: "Last Week",
      files: datedData.filter((d) => d.date > now - WEEK && d.date < now - DAY),
    },
    {
      title: "Last Month",
      files: datedData.filter(
        (d) => d.date > now - MONTH && d.date < now - WEEK
      ),
    },
    {
      title: "Last Year",
      files: datedData.filter(
        (d) => d.date > now - YEAR && d.date < now - MONTH
      ),
    },
    {
      title: "Older Than A Year",
      files: datedData.filter((d) => d.date < now - YEAR),
    },
    {
      title: "Unknown Date",
      files: unparseableData,
    },
  ];

  return groups.filter((group) => group.files.length > 0);
}

export const ReplayIndexRoute = () => {
  const { data, loading, error } = useQuery(FETCH_REPLAY_OPTIONS);

  const options = useOptions(data);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <div>
      {options.map((option) => (
        <div key={option.title}>
          <OptionTitle>{option.title}</OptionTitle>
          <OptionFiles>
            {option.files.map((file) => (
              <FileLink to={`/replay/${file.raw}`} key={file.raw}>
                {file.unparseable ? (
                  <span>{file.raw}</span>
                ) : (
                  <>
                    <span>
                      {file.date.toLocaleString("en-US", DATE_OPTIONS)}
                    </span>
                    <TimeAgo date={file.date} />
                  </>
                )}
              </FileLink>
            ))}
          </OptionFiles>
        </div>
      ))}
    </div>
  );
};
