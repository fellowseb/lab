import styled from "styled-components";
import { media } from "../components/MediaQueries.tsx";
import type { PropsWithChildren, ReactNode } from "react";

const PageSection = styled.section`
  border-bottom: 1px solid #c1b79a;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em 1em;
  ${media.medium`
      padding: 3em 1em;
  `}
`;

const PageTitle = styled.h1`
  display: flex;
  align-items: center;
  & > svg {
    width: 0.75em;
    margin-right: 2px;
  }
`;

interface PageProps {
  id: string;
  title: string;
  icon?: ReactNode;
}

const Page = (props: PropsWithChildren<PageProps>) => (
  <PageSection id={props.id}>
    <PageTitle>
      {props?.icon}
      {props.title}
    </PageTitle>
    {props.children}
  </PageSection>
);

export default Page;
