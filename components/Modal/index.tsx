import React, { ReactElement, useEffect } from 'react';
import ReactModal from 'react-overlays/Modal';
import s from './style.module.scss';
import CloseIcon from './close-icon.svg';

type ModalProps = {
  children: ReactElement | ReactElement[] | string;
  showModal: boolean;
  setShowModal: (arg: boolean) => void;
};

export const Modal = ({ children, showModal, setShowModal }: ModalProps) => {
  useEffect(() => {
    document.body.classList.toggle(s.bodyOverlayOpen, showModal);
  }, [showModal]);

  const renderBackdrop = () => <div className={s.backdrop} />;

  return (
    <ReactModal
      className={s.modalStyle}
      show={showModal}
      onHide={() => setShowModal(false)}
      renderBackdrop={renderBackdrop}
    >
      <>
        <button
          aria-label="Schließen"
          className={s.lonelyCloseButton}
          onClick={() => setShowModal(false)}
        >
          <CloseIcon alt="Modal schließen" />
        </button>
        <div className={s.modalContent}>{children}</div>
      </>
    </ReactModal>
  );
};
