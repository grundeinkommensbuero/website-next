import s from './style.module.scss';
import React, {
  useState,
  useEffect,
  useRef,
  ReactElement,
  SetStateAction,
} from 'react';
import Cookies from 'js-cookie';
const COOKIE_NAME = 'overlayHasBeenDismissed';

const init = {
  overlayOpen: false,
  toggleOverlay: () => {},
  setAutomaticOpenDelay: () => {},
};

type OverlayContext = {
  overlayOpen: boolean;
  toggleOverlay: () => void;
  setAutomaticOpenDelay: React.Dispatch<SetStateAction<boolean>>;
};

export const OverlayContext = React.createContext<OverlayContext>(init);

type OverlayProviderProps = { children: ReactElement | ReactElement[] };

export const OverlayProvider = ({ children }: OverlayProviderProps) => {
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
          document?.activeElement &&
          document.activeElement.tagName !== 'INPUT'
        ) {
          setOverlayOpen(true);
        }
      }, 1000);
    }
  }, [automaticOpenDelay, hasBeenDismissed]);

  return (
    <OverlayContext.Provider
      value={{
        overlayOpen,
        toggleOverlay: (sholdBeOpen?: boolean) => {
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
  const [hasBeenDismissed, setHasBeenDismissed] = useState<() => boolean>(
    () => {
      return Cookies.get(COOKIE_NAME) === 'true';
    }
  );

  return [
    hasBeenDismissed,
    (value: boolean) => {
      setHasBeenDismissed(() => value);
      Cookies.set(COOKIE_NAME, value.toString(), { expires: 1 });
    },
  ];
};
