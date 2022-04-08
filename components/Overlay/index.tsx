import React, { ReactElement, SetStateAction, useEffect } from 'react';
import s from './style.module.scss';
import { OverlayContext } from '../../context/Overlay';

type OverlayProps = {
  isOpenInitially?: boolean;
  isOpen: boolean;
  children: ReactElement | ReactElement[];
  title: string;
  delay?: boolean;
  toggleOverlay: () => void;
};

export const Overlay = ({
  isOpenInitially = true,
  isOpen,
  children,
  title,
  delay,
}: OverlayProps) => {
  return (
    <OverlayContext.Consumer>
      {({ overlayOpen, toggleOverlay, setAutomaticOpenDelay }) => (
        <OverlayWithContext
          isOpen={overlayOpen}
          toggleOverlay={toggleOverlay}
          setAutomaticOpenDelay={setAutomaticOpenDelay}
          title={title}
          delay={delay}
        >
          {children}
        </OverlayWithContext>
      )}
    </OverlayContext.Consumer>
  );
};

type OverlayWithContextProps = {
  isOpen: boolean;
  children: ReactElement | ReactElement[];
  title: string;
  toggleOverlay: () => void;
  delay?: boolean;
  setAutomaticOpenDelay: React.Dispatch<SetStateAction<boolean>>;
};

const OverlayWithContext = ({
  isOpen,
  children,
  title,
  toggleOverlay,
  delay,
  setAutomaticOpenDelay,
}: OverlayWithContextProps) => {
  useEffect(() => {
    if (delay) {
      setAutomaticOpenDelay(delay);
    }
    // eslint-disable-next-line
  }, [delay]);

  if (isOpen) {
    return (
      <div className={s.container} role="dialog" aria-describedby="dialogTitle">
        <button
          className={s.closeButton}
          onClick={() => toggleOverlay()}
          aria-label="Overlay Schließen"
        ></button>
        <div className={s.body}>
          {title && (
            <h2 className={s.title} id="dialogTitle">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    );
  } else {
    return null;
  }
};
