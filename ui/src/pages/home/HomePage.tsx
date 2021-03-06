import styled from "styled-components";
import { HomeChart } from "../../features/HomeChart";
import { Header } from "../../library/Header";
import { Wrapper } from "../../library/Wrapper";

const PageWrapper = styled.div`
  flex: 1;
  background: #425b76;
  color: #f5f8fa;
`;

export const HomePage = () => {
  return (
    <Wrapper>
      <Header />
      <PageWrapper>
        <HomeChart />
      </PageWrapper>
    </Wrapper>
  );
};
