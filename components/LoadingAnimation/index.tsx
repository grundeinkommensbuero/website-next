import React from 'react';
import s from './style.module.scss';
import cN from 'classnames';

export const LoadingAnimation = ({ fixed = false }) => {
  return (
    <div className={cN(s.loadingAnimationContainer, { [s.fixed]: fixed })}>
      <div className={s.loadingAnimation}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
