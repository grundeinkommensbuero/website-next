import React from 'react';
import s from './style.module.scss';
import { ValidationError } from '../ValidationError';
import cN from 'classnames';

export const Checkbox = ({
  input,
  label,
  meta,
  hide,
  theme,
  type,
  checked,
  onChange,
  className,
  labelClassName,
}) => {
  if (hide) {
    return null;
  }

  return (
    <label className={cN(s.container, className)}>
      <input
        className={s.checkbox}
        type={type}
        checked={checked}
        onChange={onChange}
        {...input}
      />
      <div className={cN(s.label, labelClassName)}>
        {label}
        {meta?.error && meta?.touched && (
          <>
            <br />
            <ValidationError theme={theme}>{meta.error}</ValidationError>
          </>
        )}
      </div>
    </label>
  );
};
