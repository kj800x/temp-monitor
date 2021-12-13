import styled from "styled-components";
import { HomeChart } from "../../features/HomeChart";

const PageWrapper = styled.div`
  flex: 1;
  background: #425b76;
  color: #f5f8fa;
`;

export const HomePage = () => {
  return (
    <PageWrapper>
      <HomeChart />
    </PageWrapper>
  );
};
