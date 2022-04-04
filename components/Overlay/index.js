import React, { useEffect } from 'react';
import s from './style.module.scss';
import { OverlayContext } from '../../context/Overlay';

export const Overlay = ({ isOpenInitially = true, ...props }) => {
  return (
    <OverlayContext.Consumer>
      {({ overlayOpen, toggleOverlay, setAutomaticOpenDelay }) => (
        <OverlayWithContext
          isOpen={overlayOpen}
          toggleOverlay={toggleOverlay}
          setAutomaticOpenDelay={setAutomaticOpenDelay}
          {...props}
        />
      )}
    </OverlayContext.Consumer>
  );
};

const OverlayWithContext = ({
  isOpen,
  children,
  title,
  toggleOverlay,
  delay,
  setAutomaticOpenDelay,
}) => {
  useEffect(() => {
    if (delay) {
      setAutomaticOpenDelay(delay);
    }
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
