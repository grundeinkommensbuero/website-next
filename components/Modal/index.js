import React, { useEffect } from 'react';
import ReactModal from 'react-overlays/Modal';
import s from './style.module.scss';
import closeIcon from './close-icon.svg';

export const Modal = ({ children, showModal, setShowModal }) => {
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
          <img
            className={s.innerCloseIcon}
            src={closeIcon}
            alt="Modal schließen"
          />
        </button>
        <div className={s.modalContent}>{children}</div>
      </>
    </ReactModal>
  );
};
