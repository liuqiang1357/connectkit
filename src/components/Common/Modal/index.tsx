import React, { useCallback, useEffect, useState } from 'react';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Props } from 'framer-motion/types/types';

import { ResetContainer } from '../../../styles';
import Portal from '../Portal';

import { isMobile } from '../../../utils';

import {
  Container,
  BoxContainer,
  ModalContainer,
  PageContainer,
  PageContents,
  ControllerContainer,
  InnerContainer,
  BackgroundOverlay,
  CloseButton,
  BackButton,
  InfoButton,
  TextWithHr,
} from './styles';

import { useContext } from '../../ConnectKit';
import useLockBodyScroll from '../../../hooks/useLockBodyScroll';

import { useTransition } from 'react-transition-state';

const InfoIcon = (props: Props) => (
  <svg
    aria-hidden="true"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11ZM22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11ZM11.6445 12.7051C11.6445 13.1348 11.3223 13.4678 10.7744 13.4678C10.2266 13.4678 9.92578 13.1885 9.92578 12.6191V12.4795C9.92578 11.4268 10.4951 10.8574 11.2686 10.3203C12.2031 9.67578 12.665 9.32129 12.665 8.59082C12.665 7.76367 12.0205 7.21582 11.043 7.21582C10.3232 7.21582 9.80762 7.57031 9.45312 8.16113C9.38282 8.24242 9.32286 8.32101 9.2667 8.39461C9.04826 8.68087 8.88747 8.8916 8.40039 8.8916C8.0459 8.8916 7.66992 8.62305 7.66992 8.15039C7.66992 7.96777 7.70215 7.7959 7.75586 7.61328C8.05664 6.625 9.27051 5.75488 11.1182 5.75488C12.9336 5.75488 14.5234 6.71094 14.5234 8.50488C14.5234 9.7832 13.7822 10.417 12.7402 11.1045C11.999 11.5986 11.6445 11.9746 11.6445 12.5762V12.7051ZM11.9131 15.5625C11.9131 16.1855 11.376 16.6797 10.7529 16.6797C10.1299 16.6797 9.59277 16.1748 9.59277 15.5625C9.59277 14.9395 10.1191 14.4453 10.7529 14.4453C11.3867 14.4453 11.9131 14.9287 11.9131 15.5625Z"
      fill="currentColor"
    />
  </svg>
);
const CloseIcon = (props: Props) => (
  <motion.svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 13L13 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M1 0.999999L13 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </motion.svg>
);
const BackIcon = (props: Props) => (
  <motion.svg
    width={9}
    height={16}
    viewBox="0 0 9 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 1L1 8L8 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

const contentTransitionDuration = 0.22;

export const contentVariants: Variants = {
  initial: {
    //willChange: 'transform,opacity',
    zIndex: 2,
    opacity: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: contentTransitionDuration * 0.75,
      delay: contentTransitionDuration * 0.25,
      ease: [0.26, 0.08, 0.25, 1],
    },
  },
  exit: {
    zIndex: 1,
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    left: ['50%', '50%'],
    x: ['-50%', '-50%'],
    transition: {
      duration: contentTransitionDuration,
      ease: [0.26, 0.08, 0.25, 1],
    },
  },
};

type ModalProps = {
  open: boolean | undefined;
  pages: any;
  pageId: string;
  onClose?: () => void | undefined;
  onBack?: () => void | undefined;
  positionInside?: boolean;
  hideOverlay?: boolean;
};
const Modal: React.FC<ModalProps> = ({
  open,
  pages,
  pageId,
  onClose,
  onBack,
  positionInside,
  hideOverlay,
}) => {
  const context = useContext();
  const mobile = isMobile();

  const [state, setOpen] = useTransition({
    timeout: 150,
    preEnter: true,
    mountOnEnter: true,
    unmountOnExit: true,
  });
  const mounted = !(state === 'exited' || state === 'unmounted');
  const rendered = state === 'preEnter' || state !== 'exiting';
  if (!positionInside) useLockBodyScroll(mounted);

  useEffect(() => {
    setOpen(open);
  }, [open]);

  const [dimensions, setDimensions] = useState<{
    width: string | undefined;
    height: string | undefined;
  }>({
    width: undefined,
    height: undefined,
  });
  const contentRef = useCallback(
    (node: any) => {
      if (!node) return;
      const bounds = {
        width: node?.offsetWidth,
        height: node?.offsetHeight,
      };
      setDimensions({
        width: mobile ? `100%` : `${bounds?.width}px`,
        height: `${bounds?.height}px`,
      });
    },
    [open]
  );

  useEffect(() => {
    if (!mounted) {
      setDimensions({ width: undefined, height: undefined });
      return;
    }

    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [mounted, onClose]);

  const dimensionsCSS = {
    '--height': dimensions.height,
    '--width': dimensions.width,
  } as React.CSSProperties;

  const Content = (
    <ResetContainer theme={context.theme} customTheme={context.customTheme}>
      <ModalContainer
        role="dialog"
        style={{
          pointerEvents: rendered ? 'auto' : 'none',
          position: positionInside ? 'absolute' : undefined,
        }}
      >
        {!hideOverlay && (
          <BackgroundOverlay $active={rendered} onClick={onClose} />
        )}
        <Container style={dimensionsCSS}>
          <BoxContainer
            className={`${mobile ? 'mobile' : ''} ${rendered && 'active'}`}
          >
            <ControllerContainer>
              <CloseButton aria-label="Close" onClick={onClose}>
                <CloseIcon />
              </CloseButton>
              <AnimatePresence>
                {onBack ? (
                  <BackButton
                    aria-label="Back"
                    key="backButton"
                    onClick={onBack}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <BackIcon />
                  </BackButton>
                ) : (
                  <InfoButton
                    aria-label="More information"
                    key="infoButton"
                    //onClick={onInfo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <InfoIcon />
                  </InfoButton>
                )}
              </AnimatePresence>
            </ControllerContainer>

            <InnerContainer>
              {Object.keys(pages).map((key) => {
                const page = pages[key];
                return (
                  <Page
                    key={key}
                    open={key === pageId}
                    initial={!positionInside && state !== 'entered'}
                  >
                    <PageContents
                      key={`inner-${key}`}
                      ref={contentRef}
                      style={{
                        pointerEvents: key === pageId ? 'auto' : 'none',
                      }}
                    >
                      {page}
                    </PageContents>
                  </Page>
                );
              })}
            </InnerContainer>
          </BoxContainer>
        </Container>
      </ModalContainer>
    </ResetContainer>
  );

  return (
    <>
      {mounted && (
        <>{positionInside ? Content : <>{<Portal>{Content}</Portal>}</>}</>
      )}
    </>
  );
};

type PageProps = {
  children?: React.ReactNode;
  open: boolean | undefined;
  initial: boolean;
};
const Page: React.FC<PageProps> = ({ children, open, initial }) => {
  const [state, setOpen] = useTransition({
    timeout: 220,
    preEnter: true,
    initialEntered: open,
    mountOnEnter: true,
    unmountOnExit: true,
  });
  const mounted = !(state === 'exited' || state === 'unmounted');
  const rendered = state === 'preEnter' || state !== 'exiting';

  useEffect(() => {
    setOpen(open);
  }, [open]);

  if (!mounted) return null;
  return (
    <PageContainer
      className={`${rendered ? 'active' : 'exit'}`}
      style={{
        animationDuration: initial ? '0ms' : undefined,
        animationDelay: initial ? '0ms' : undefined,
      }}
    >
      {children}
    </PageContainer>
  );
};

export const OrDivider = ({ text = 'or' }) => {
  return (
    <TextWithHr>
      <span>{text}</span>
    </TextWithHr>
  );
};

export default Modal;
