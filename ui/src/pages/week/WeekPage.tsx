import styled from "styled-components";
import { Header } from "../../library/Header";
import { Wrapper } from "../../library/Wrapper";
import { WeekChart } from "./WeekChart";

const PageWrapper = styled.div`
  flex: 1;
  background: #425b76;
  color: #f5f8fa;
`;

export const WeekPage = () => {
  return (
    <Wrapper>
      <Header referenceDateEnabled={false} />
      <PageWrapper>
        <WeekChart />
      </PageWrapper>
    </Wrapper>
  );
};
