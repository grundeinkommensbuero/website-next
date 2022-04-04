import React, { ReactElement } from 'react';
import s from './style.module.scss';

export const Spinner = (): ReactElement => {
  return <span className={s.loading}></span>;
};
