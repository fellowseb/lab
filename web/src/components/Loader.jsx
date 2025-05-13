import React from "react";
import styled, { keyframes } from "styled-components";

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #c1b79a;
`;

const Spinner = styled.div`
  border-radius: 100%;
  display: flex;
  flex-direction: row;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
`;

const skbouncedelay = keyframes`
  0%, 80%, 100% { 
    transform: scale(0);
  }
  40% { 
    transform: scale(1.0);
  }
`;

const Bounce = styled.div`
  width: 18px;
  height: 18px;
  background-color: #333;

  border-radius: 100%;
  display: inline-block;
  animation: ${skbouncedelay} 1.4s infinite ease-in-out both;
`;

const Bounce1 = styled(Bounce)`
  animation-delay: -0.32s;
`;

const Bounce2 = styled(Bounce)`
  animation-delay: -0.16s;
`;

const Bounce3 = styled(Bounce)`
  animation-delay: -0.8;
`;

/**
 * Presentational component displaying a loader.
 */
const Loader = () => (
  <LoaderContainer>
    <Spinner>
      <Bounce1 />
      <Bounce2 />
      <Bounce3 />
    </Spinner>
  </LoaderContainer>
);

module.exports = Loader;
