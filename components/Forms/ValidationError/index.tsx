import React, { ReactElement } from 'react';
import s from './style.module.scss';
import cN from 'classnames';

type ValidationErrorProps = {
  children: ReactElement | string;
  className?: string;
  theme?: string;
};

export const ValidationError = ({
  children,
  className,
  theme,
}: ValidationErrorProps) => {
  return <div className={cN(s.error, className)}>{children}</div>;
};
