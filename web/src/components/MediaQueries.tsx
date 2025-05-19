import { css } from "styled-components";

const sizes = {
  large: 768,
  medium: 700,
};

type MediaSize = keyof typeof sizes;

export const media = Object.keys(sizes).reduce(
  (accumulator, label) => {
    const typedLabel = label as keyof typeof sizes;
    const emSize = sizes[typedLabel] / 16;
    accumulator[typedLabel] = (...args) => css`
      @media screen and (min-width: ${emSize}em) {
        ${css(...args)}
      }
    `;
    return accumulator;
  },
  {} as Record<
    MediaSize,
    (...args: Parameters<typeof css>) => ReturnType<typeof css>
  >,
);
