import s from './style.module.scss';
import React, {
  useState,
  useEffect,
  SetStateAction,
  ReactElement,
} from 'react';
import { Modal } from '../../components/Modal';
import Onboarding from '../../components/Onboarding';

export const OnboardingModalContext = React.createContext<{
  showModal: boolean;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
}>({
  showModal: false,
  setShowModal: () => {},
});

type OnboardingModalProviderProps = {
  children: ReactElement | ReactElement[] | string;
};

export const OnboardingModalProvider = ({
  children,
}: OnboardingModalProviderProps) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.body.classList.toggle(s.bodyOverlayOpen, showModal);
  }, [showModal]);

  return (
    <OnboardingModalContext.Provider
      value={{
        showModal,
        setShowModal,
      }}
    >
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <Onboarding />
      </Modal>
      {children}
    </OnboardingModalContext.Provider>
  );
};
