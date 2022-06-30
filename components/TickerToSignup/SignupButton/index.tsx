import React, { ReactElement, useContext } from 'react';
import { OnboardingModalContext } from '../../../context/OnboardingModal';
import s from './style.module.scss';

import { Button } from '../../Forms/Button';

type SignUpButtonProps = {
  children: ReactElement | ReactElement[] | string;
  className?: string;
};

export const SignUpButton = ({ children, className }: SignUpButtonProps) => {
  const { setShowModal } = useContext(OnboardingModalContext);

  return (
    <div className={s.signUpButton}>
      <Button
        className={className}
        aria-label="Anmelden"
        onClick={() => setShowModal(true)}
      >
        {children}
      </Button>
    </div>
  );
};
