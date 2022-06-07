import React, { ReactElement, SetStateAction } from 'react';
import s from './style.module.scss';
import cN from 'classnames';

type HamburgerMenuProps = {
  isActive: boolean;
  setIsActive: React.Dispatch<SetStateAction<boolean>>;
};

export const HamburgerMenu = ({
  isActive,
  setIsActive,
}: HamburgerMenuProps): ReactElement => {
  return (
    <button
      className={cN(s.hamburger, { [s.isActive]: isActive })}
      onClick={() => setIsActive(!isActive)}
    />
  );
};
