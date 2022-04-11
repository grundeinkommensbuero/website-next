import React, { ReactElement } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import { ValidationError } from '../ValidationError';
import { Tooltip } from '../../Tooltip';

type LabelInputErrorWrapperProps = {
  children?: ReactElement;
  className?: string;
  label?: string;
  meta?: {
    error: string;
    touched: boolean;
  };
  theme?: string;
  explanation?: string;
  errorClassName?: string;
};

export default function LabelInputErrorWrapper({
  children,
  className,
  label,
  meta,
  theme,
  explanation,
  errorClassName,
}: LabelInputErrorWrapperProps) {
  return (
    <label className={cN(s.container, className)}>
      <div>
        {label}
        {explanation && (
          <>
            {' '}
            <Tooltip content={explanation} popupClassName={s.tooltip}>
              (i)
            </Tooltip>
          </>
        )}
      </div>
      <div>{children}</div>
      {meta?.error && meta?.touched && (
        <ValidationError className={cN(s.error, errorClassName)} theme={theme}>
          {meta.error}
        </ValidationError>
      )}
    </label>
  );
}
