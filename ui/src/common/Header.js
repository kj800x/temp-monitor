import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { FETCH_APP_STATE, SET_LOGGING } from "../queries";
import { useMutation, useQuery } from "@apollo/react-hooks";

const HeaderWrapper = styled.div`
  padding: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid black;
  background-color: #69a7bb;
`;
const LeftWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const RightWrapper = LeftWrapper;

const StyledNavLink = styled(NavLink)`
  margin-left: 12px;
  background: rgb(75 106 138);
  position: relative;
  bottom: -4px;
  padding: 4px 10px;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;

  &.active {
    color: rgb(4 26 49);
    font-weight: 600;
  }
`;

const HeaderButton = styled.div`
  cursor: pointer;
  user-select: none;
  border: 1px solid black;
  padding: 4px;
  background: rgb(45, 62, 80);
  margin-left: 12px;
`;
const HeaderTitle = styled.div`
  cursor: auto;
  user-select: none;
  font-size: x-large;
  font-weight: 600;
  font-style: italic;
  color: rgb(45, 62, 80);
`;

export const Header = ({ setEditable, editable, isLogging, toggleLogging }) => {
  const { data: appStateData } = useQuery(FETCH_APP_STATE);
  const [setLogging] = useMutation(SET_LOGGING);

  return (
    <HeaderWrapper>
      <LeftWrapper>
        <HeaderTitle>Temperature</HeaderTitle>
        <StyledNavLink exact to="/">
          Live
        </StyledNavLink>
      </LeftWrapper>
      <RightWrapper>
        {appStateData && window.location.href.includes("admin") && (
          <HeaderButton
            onClick={() => {
              setLogging({
                variables: { logging: !appStateData.appState.logging },
              });
            }}
          >
            Logging
            <input
              type="checkbox"
              checked={appStateData.appState.logging}
              readOnly={true}
            />
          </HeaderButton>
        )}
      </RightWrapper>
    </HeaderWrapper>
  );
};
