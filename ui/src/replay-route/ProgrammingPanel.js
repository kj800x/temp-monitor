import React, { useEffect, useState } from "react";
import styled from "styled-components";

const PanelWrapper = styled.div`
  padding: 4px;
  border-left: 1px solid black;
  width: 700px;
  display: flex;
  flex-direction: column;
`;

const CodeEditor = styled.textarea`
  flex: 1;
  margin: 4px;
  padding: 4px;
  background: black;
  color: green;
`;

const ButtonWrapper = styled.div`
  margin: 4px;
  display: flex;
  flex-direction: row-reverse;
`;
const Button = styled.button`
  border: 1px solid ${({ changed }) => (changed ? "red" : "black")};
  background: black;
  color: white;
`;

export const ProgrammingPanel = ({ program, setProgram }) => {
  const [localProgram, setLocalProgram] = useState(program);

  useEffect(() => {
    setLocalProgram(program);
  }, [program]);

  return (
    <PanelWrapper>
      <CodeEditor
        value={localProgram}
        options={{
          theme: "monokai",
          keyMap: "sublime",
          tabSize: 2,
          mode: "js",
        }}
        onChange={(event) => {
          setLocalProgram(event.target.value);
          event.stopPropagation();
          event.preventDefault();
        }}
        onKeyDown={(event) => event.stopPropagation()}
      />
      <ButtonWrapper>
        <Button
          changed={localProgram !== program}
          onClick={() => {
            setProgram(localProgram);
          }}
        >
          Save
        </Button>
      </ButtonWrapper>
    </PanelWrapper>
  );
};
