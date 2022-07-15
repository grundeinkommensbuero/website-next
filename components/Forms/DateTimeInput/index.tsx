import React, { Ref } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import LabelInputErrorWrapper from '../LabelInputErrorWrapper';

export const DateInput = ({
  className,
  label,
  customRef,
  ...input
}: {
  className?: string;
  label: string;
  customRef?: Ref<any>;
  input?: any;
}) => {
  return (
    <input
      aria-label={label}
      type="date"
      {...input}
      className={cN(s.input, className)}
      ref={customRef}
    />
  );
};

export const TimeInput = ({
  className,
  label,
  ...input
}: {
  className?: string;
  label: string;
  input?: any;
}) => {
  return (
    <input
      aria-label={label}
      type="time"
      {...input}
      className={cN(s.input, className)}
    />
  );
};

type DateInputeWrappedProps = {
  input?: any;
  label: string;
  className?: string;
  inputClassName?: string;
  meta?: {
    error: string;
    touched: boolean;
  };
  description?: string;
  hideLabel?: boolean;
  explanation?: string;
  customRef?: Ref<any>;
  hide?: boolean;
  theme?: string;
};

export const DateInputWrapped = ({
  input,
  label,
  meta,
  description,
  hide,
  theme,
  className,
  inputClassName,
  hideLabel,
  explanation,
  customRef,
}: DateInputeWrappedProps) => {
  if (hide) {
    return null;
  }
  const outputLabel = description ? `${label} (${description})` : label;
  return (
    <LabelInputErrorWrapper
      label={!hideLabel ? outputLabel : undefined}
      meta={meta}
      className={className}
      explanation={explanation}
      theme={theme}
    >
      <DateInput
        className={inputClassName}
        label={outputLabel}
        customRef={customRef}
        {...input}
      />
    </LabelInputErrorWrapper>
  );
};

type TimeInputeWrappedProps = {
  input?: any;
  label: string;
  className?: string;
  inputClassName?: string;
  meta?: {
    error: string;
    touched: boolean;
  };
  description?: string;
  hideLabel?: boolean;
  explanation?: string;
  hide?: boolean;
  theme?: string;
};

export const TimeInputWrapped = ({
  input,
  label,
  meta,
  description,
  hide,
  theme,
  className,
  inputClassName,
  hideLabel,
  explanation,
}: TimeInputeWrappedProps) => {
  if (hide) {
    return null;
  }
  const outputLabel = description ? `${label} (${description})` : label;
  return (
    <LabelInputErrorWrapper
      label={!hideLabel ? outputLabel : undefined}
      meta={meta}
      className={className}
      explanation={explanation}
      theme={theme}
    >
      <TimeInput className={inputClassName} label={outputLabel} {...input} />
    </LabelInputErrorWrapper>
  );
};
