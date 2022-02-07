import styled from "styled-components";
import { Header } from "../../library/Header";
import { Wrapper } from "../../library/Wrapper";
import { HighLowCharts } from "./HighLowCharts";

const PageWrapper = styled.div`
  flex: 1;
  background: #425b76;
  color: #f5f8fa;
`;

export const HighLowPage = () => {
  return (
    <Wrapper>
      <Header referenceDateEnabled={false} />
      <PageWrapper>
        <HighLowCharts />
      </PageWrapper>
    </Wrapper>
  );
};
