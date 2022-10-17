import React from 'react';
import s from './style.module.scss';
import cN from 'classnames';

export const LoadingAnimation = ({
  fixed = false,
  className,
}: {
  fixed?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cN(s.loadingAnimationContainer, {
        [s.fixed]: fixed,
      })}
    >
      <div className={cN(s.loadingAnimation, className)}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
