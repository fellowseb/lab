import styled, { css } from "styled-components";

import Page from "../components/Page.tsx";
import { P, Strong } from "../components/BaseStyledComponents.tsx";
import { media } from "../components/MediaQueries.tsx";
import BooksSvg from "/src/assets/images/svg/books.svg";
import CodeSvg from "/src/assets/images/svg/code.svg";
import LabSvg from "/src/assets/images/svg/lab.svg";
import AboutIconSvg from "/src/assets/images/svg/about.svg";

const PurposeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-around;
  width: 100%;
  box-sizing: border-box;
  max-width: 800px;
`;

const PurposeSubContainer = styled.div`
  max-width: 700px;
`;

const PurposeSubContainerLeft = styled(PurposeSubContainer)`
  align-self: flex-start;
`;

const PurposeSubContainerRight = styled(PurposeSubContainer)`
  align-self: flex-end;
`;

const PurposeTitle = styled(P)`
  font-weight: bold;
  font-size: 1.1em;
  background: #c1b79a;
  margin: 0;
  color: #786b49;
  padding: 0 0 0 4px;
  border-radius: 6px;
  border: 1px solid #beb598;
`;

const PurposeHeader = styled.header`
  clear: both;
`;

const PurposeIconCss = css`
  width: 100%;
  height: 100%;
  filter: drop-shadow(6px 6px 1px rgba(149, 133, 87, 1));
  fill: #333333;
`;

const StyledBooksSvg = styled(BooksSvg)`
  ${PurposeIconCss}
`;

const StyledCodeSvg = styled(CodeSvg)`
  ${PurposeIconCss}
`;

const StyledLabSvg = styled(LabSvg)`
  ${PurposeIconCss}
`;

const PurposeFigure = styled.figure`
  width: 4em;
  height: 4em;
  ${media.medium`
        width: 6em;
        height: 6em;
    `}
  margin: .5em;
  float: left;
`;

const AboutPage = () => (
  <Page id="page-about" title="About" icon={<AboutIconSvg />}>
    <PurposeContainer>
      <PurposeSubContainerLeft>
        <PurposeHeader>
          <PurposeTitle>Who am I ?</PurposeTitle>
        </PurposeHeader>
        <PurposeFigure>
          <StyledCodeSvg />
        </PurposeFigure>
        <P>
          My name is <Strong>S&eacute;bastien Wauquier</Strong>.<br />
          I&apos;m a seasoned <Strong>Staff Software Engineer</Strong>, based in
          Paris, France. While I'm specialized in the frontend I have strong
          appetite for topics that span across the entire stack (Architecture,
          Distributed Systems, Cryptography, DDD, LLMs...) and that affect the
          whole development cycle (DX tooling, Platform Engineering, CI, testing
          practices...).
        </P>
      </PurposeSubContainerLeft>
      <PurposeSubContainerRight>
        <PurposeHeader>
          <PurposeTitle>What is this ?</PurposeTitle>
        </PurposeHeader>
        <PurposeFigure>
          <StyledLabSvg />
        </PurposeFigure>
        <P>
          This is <Strong>my personal space on the interwebs</Strong>, the front
          page of my very own code lab, a place where I can hold myself
          accountable for completing my projects, review books, articles &
          talks, and where I can showcase and share my findings.
          <br />
          It's also a page where you'll find traditional blog posts about other
          non-tech topics (music, acting, sports...).
        </P>
      </PurposeSubContainerRight>
      <PurposeSubContainerLeft>
        <PurposeHeader>
          <PurposeTitle>What&apos;s the point ?</PurposeTitle>
        </PurposeHeader>
        <PurposeFigure>
          <StyledBooksSvg />
        </PurposeFigure>
        <P>
          I believe one should always keep on learning.
          <br />
          There are so many things{" "}
          <Strong>to discover, to read, to share</Strong>! The problem is it's
          not always possible (nor reasonable) to apply new tech at work.
          <br />
          Side projects deserve their own front page !
        </P>
      </PurposeSubContainerLeft>
    </PurposeContainer>
  </Page>
);

export default AboutPage;
