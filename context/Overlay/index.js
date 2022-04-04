import s from './style.module.scss';
import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
const COOKIE_NAME = 'overlayHasBeenDismissed';

export const OverlayContext = React.createContext();

export const OverlayProvider = ({ children }) => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [automaticOpenDelay, setAutomaticOpenDelay] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useHasBeenDismissed();
  const hasBeenDismissedRef = useRef(hasBeenDismissed);
  hasBeenDismissedRef.current = hasBeenDismissed;

  useEffect(() => {
    document.body.classList.toggle(s.bodyOverlayOpen, overlayOpen);
  }, [overlayOpen]);

  useEffect(() => {
    if (automaticOpenDelay) {
      setTimeout(() => {
        if (
          !hasBeenDismissedRef.current &&
          document.activeElement.tagName !== 'INPUT'
        ) {
          setOverlayOpen(true);
        }
      }, automaticOpenDelay * 1000);
    }
  }, [automaticOpenDelay, hasBeenDismissed]);

  return (
    <OverlayContext.Provider
      value={{
        overlayOpen,
        toggleOverlay: sholdBeOpen => {
          if (sholdBeOpen !== undefined) {
            setOverlayOpen(sholdBeOpen);
          } else {
            setOverlayOpen(!overlayOpen);
          }
          setHasBeenDismissed(true);
        },
        setAutomaticOpenDelay,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

const useHasBeenDismissed = () => {
  const [hasBeenDismissed, setHasBeenDismissed] = useState(() => {
    return Cookies.get(COOKIE_NAME) === 'true';
  });

  return [
    hasBeenDismissed,
    value => {
      setHasBeenDismissed(value);
      Cookies.set(COOKIE_NAME, value, { expires: 1 });
    },
  ];
};
