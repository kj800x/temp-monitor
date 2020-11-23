import React from "react";

import { useParams } from "react-router-dom";
import { ReplayCharts } from "./ReplayCharts";
import { ProgrammingPanel } from "./ProgrammingPanel";
import { useAppState } from "../common/useAppState";

export const ReplayRoute = ({ windowWidth, editable }) => {
  const { file } = useParams();

  const [program, setProgram] = useAppState("program", "");

  return (
    <>
      <ReplayCharts
        windowWidth={editable ? windowWidth - 700 : windowWidth}
        file={file}
        program={program}
      />
      {editable && (
        <ProgrammingPanel program={program} setProgram={setProgram} />
      )}
    </>
  );
};
