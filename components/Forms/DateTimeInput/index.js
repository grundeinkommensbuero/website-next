import React from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import LabelInputErrorWrapper from '../LabelInputErrorWrapper';

export const DateInput = ({ className, label, size, customRef, ...input }) => {
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

export const TimeInput = ({ className, label, size, ...input }) => {
  return (
    <input
      aria-label={label}
      type="time"
      {...input}
      className={cN(s.input, className)}
    />
  );
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
}) => {
  if (hide) {
    return null;
  }
  const outputLabel = description ? `${label} (${description})` : label;
  return (
    <LabelInputErrorWrapper
      label={!hideLabel && outputLabel}
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
}) => {
  if (hide) {
    return null;
  }
  const outputLabel = description ? `${label} (${description})` : label;
  return (
    <LabelInputErrorWrapper
      label={!hideLabel && outputLabel}
      meta={meta}
      className={className}
      explanation={explanation}
      theme={theme}
    >
      <TimeInput className={inputClassName} label={outputLabel} {...input} />
    </LabelInputErrorWrapper>
  );
};
