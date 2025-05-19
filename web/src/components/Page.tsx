import styled from "styled-components";
import { media } from "../components/MediaQueries.tsx";
import type { PropsWithChildren } from "react";

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

interface PageProps {
  id: string;
  title: string;
}

const Page = (props: PropsWithChildren<PageProps>) => (
  <PageSection id={props.id}>
    <h1>{props.title}</h1>
    {props.children}
  </PageSection>
);

export default Page;
