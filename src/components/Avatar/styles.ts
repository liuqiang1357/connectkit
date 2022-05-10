import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

function addressToNumber(address: string) {
  return (
    (address
      .split('')
      .map((l) => l.charCodeAt(0))
      .reduce((a, b) => a + b) %
      100) /
    100
  );
}

export const EnsAvatar = styled(motion.div)<{ $seed?: string; $size?: number }>`
  pointer-events: none;
  user-select: none;
  position: relative;
  overflow: hidden;
  margin: 0;
  border-radius: 50%;
  width: ${(props) => (props.$size ? props.$size : 96)}px;
  height: ${(props) => (props.$size ? props.$size : 96)}px;
  background: var(--body-background-secondary);
  ${(props) => {
    if (props.$seed) {
      const ensColor = `0${Math.ceil(addressToNumber(props.$seed) * 8)}`;
      return css`
        background: var(--ens-${ensColor}-start);
        background: linear-gradient(
          180deg,
          var(--ens-${ensColor}-start) 0%,
          var(--ens-${ensColor}-stop) 100%
        );
      `;
    }
  }}
`;

export const ImageContainer = styled(motion.img)<{ $loaded: boolean }>`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  opacity: ${(props) => (props.$loaded ? 1 : 0)};
  transition: opacity 500ms ease;
`;