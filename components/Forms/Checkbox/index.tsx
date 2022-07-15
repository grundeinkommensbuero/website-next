import React from 'react';
import s from './style.module.scss';
import { ValidationError } from '../ValidationError';
import cN from 'classnames';

type CheckboxProps = {
  input?: any;
  label: string;
  className?: string;
  labelClassName?: string;
  checked: boolean;
  type?: string;
  meta?: {
    error: string;
    touched: boolean;
  };
  onChange?: () => void;
  hide?: boolean;
  theme?: string;
};

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
}: CheckboxProps) => {
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
