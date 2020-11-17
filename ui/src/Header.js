import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  padding: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid black;
  background-color: #4f2c09;
`;
const LeftWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const RightWrapper = LeftWrapper;

const StyledNavLink = styled(NavLink)`
  margin-left: 12px;
  background: #504311;
  position: relative;
  bottom: -4px;
  padding: 4px 10px;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;

  &.active {
    color: yellow;
    font-weight: 600;
  }
`;

const HeaderButton = styled.div`
  cursor: pointer;
  user-select: none;
  border: 1px solid black;
  padding: 4px;
  background: #793d00;
`;
const HeaderTitle = styled.div`
  cursor: auto;
  user-select: none;
  font-size: x-large;
  font-weight: 600;
  font-style: italic;
  color: #ffed00;
`;

export const Header = ({ setEditable, editable, isLogging, toggleLogging }) => (
  <HeaderWrapper>
    <LeftWrapper>
      <HeaderTitle>Motor Control</HeaderTitle>
      <StyledNavLink exact to="/">
        Live
      </StyledNavLink>
      <StyledNavLink exact to="/replay">
        Replay
      </StyledNavLink>
    </LeftWrapper>
    <RightWrapper>
      <HeaderButton onClick={toggleLogging}>
        Logging
        <input type="checkbox" checked={isLogging} readOnly={true} />
      </HeaderButton>
      <HeaderButton onClick={() => setEditable((editable) => !editable)}>
        Editable
        <input type="checkbox" checked={editable} readOnly={true} />
      </HeaderButton>
    </RightWrapper>
  </HeaderWrapper>
);
