import { css } from 'styled-components';

const sizes = {
    large: 768,
    medium: 700
};

export const media = Object.keys(sizes).reduce((accumulator, label) => {
    const emSize = sizes[label] / 16;
    accumulator[label] = (...args) => css`
    @media screen and (min-width: ${emSize}em) {
      ${css(...args)}
    }
  `;
    return accumulator;
}, {});
