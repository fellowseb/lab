import React from 'react';
import styled from 'styled-components';

import Page from '../components/Page.jsx';
import { P, Strong } from '../components/BaseStyledComponents.jsx';
import { media } from '../components/MediaQueries.jsx';

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
    max-width: 500px;
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

const PurposeIcon = styled.svg`
    width: 100%;
    height: 100%;
    filter: drop-shadow(6px 6px 1px rgba(149,133,87,1));
    fill: #333333;
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
    <Page>
        <PurposeContainer>
            <PurposeSubContainerLeft>
                <PurposeHeader>
                    <PurposeTitle>Who am I ?</PurposeTitle>
                </PurposeHeader>
                <PurposeFigure>
                    <PurposeIcon>
                        <use href="#code" />
                    </PurposeIcon>
                </PurposeFigure>
                <P>My name is <Strong>S&eacute;bastien Wauquier</Strong>.<br />
                  I&apos;m a Software Engineer. In the past years I&apos;ve dealt with real-time 3D apps on desktop (in C++) or in the browser (JavaScript).</P>
            </PurposeSubContainerLeft>
            <PurposeSubContainerRight>
                <PurposeHeader>
                    <PurposeTitle>What is this ?</PurposeTitle>
                </PurposeHeader>
                <PurposeFigure>
                    <PurposeIcon>
                        <use href="#lab" />
                    </PurposeIcon>
                </PurposeFigure>
                <P>This is my <Strong>virtual laboratory</Strong>.<br />I intend to experiment cool tech stuff and maybe later extend it to art and life in general.</P>
            </PurposeSubContainerRight>
            <PurposeSubContainerLeft>
                <PurposeHeader>
                    <PurposeTitle>What&apos;s the point ?</PurposeTitle>
                </PurposeHeader>
                <PurposeFigure>
                    <PurposeIcon>
                        <use href="#books" />
                    </PurposeIcon>
                </PurposeFigure>
                <P>I believe one should always <Strong>keep on learning</Strong>.<br />There are so many things to discover, to read, to share!</P>
            </PurposeSubContainerLeft>
        </PurposeContainer>
    </Page>
);

export default AboutPage;
