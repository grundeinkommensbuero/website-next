import React from 'react';
import s from './style.module.scss';

export const RadioButton = ({ input, label }) => {
  return (
    <label className={s.container}>
      <input {...input} />
      <span className={s.radio}></span>
      {label}
    </label>
  );
};
