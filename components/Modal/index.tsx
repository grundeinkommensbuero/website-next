import React, { ReactElement, useEffect } from 'react';
import ReactModal from 'react-overlays/Modal';
import s from './style.module.scss';
import cN from 'classnames';
import CloseIcon from './close-icon.svg';
import CloseIconHamburg from './close-icon-hamburg.svg';
import { ColorScheme } from '../Section';

const IS_HAMBURG_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Hamburg';

type ModalProps = {
  children: ReactElement | ReactElement[] | string;
  showModal: boolean;
  setShowModal: (arg: boolean) => void;
  colorScheme?: ColorScheme;
  noFixedHeight?: boolean;
};

export const Modal = ({
  children,
  showModal,
  setShowModal,
  colorScheme,
  noFixedHeight,
}: ModalProps) => {
  useEffect(() => {
    document.body.classList.toggle(s.bodyOverlayOpen, showModal);

    return () => {
      document.body.classList.toggle(s.bodyOverlayOpen, false);
    };
  }, [showModal]);

  const renderBackdrop = () => <div className="backdrop" />;

  return (
    <ReactModal
      className={`${cN(
        s.modalStyle,
        { [s.hamburg]: IS_HAMBURG_PROJECT },
        { hamburg: IS_HAMBURG_PROJECT },
        { [s.noFixedHeight]: noFixedHeight }
      )} ${colorScheme}`}
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
          {IS_HAMBURG_PROJECT ? (
            <CloseIconHamburg
              alt="Modal schließen"
              height={36}
              width={36}
              fill="#000"
            />
          ) : (
            <CloseIcon alt="Modal schließen" />
          )}
        </button>
        <div className={s.modalContent}>{children}</div>
      </>
    </ReactModal>
  );
};
