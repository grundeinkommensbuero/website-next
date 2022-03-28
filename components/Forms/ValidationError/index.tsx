import React, { ReactElement } from 'react';
import s from './style.module.scss';
import cN from 'classnames';

type ValidationErrorProps = {
  children: ReactElement | string;
  className?: string;
};

export const ValidationError = ({
  children,
  className,
}: ValidationErrorProps) => {
  return <div className={cN(s.error, className)}>{children}</div>;
};
