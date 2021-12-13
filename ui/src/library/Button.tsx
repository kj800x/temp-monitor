import styled from "styled-components";

export const Button = styled.div<{ use?: "delete"; disabled?: boolean }>`
  border: 1px solid #cbd6e2;
  padding: 0.2em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 15px;
  background: ${({ use }) => (use === "delete" ? "#d94c71" : "#425b76")};
  line-height: 15px;
  cursor: pointer;
  user-select: none;
  margin-left: 8px;

  input[readonly] {
    cursor: pointer;
  }

  &[disabled] {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 60%;
  }
`;
