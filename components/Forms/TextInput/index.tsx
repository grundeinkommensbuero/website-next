import React from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import LabelInputErrorWrapper from '../LabelInputErrorWrapper';
import { ValidationError } from '../ValidationError';

export function TextInput({
  children,
  className,
  label,
  size,
  customRef,
  ...input
}) {
  return (
    <input
      onFocus={e => {
        if (e.target.autocomplete) {
          e.target.autocomplete = 'none';
        }
      }}
      aria-label={label}
      type={'search'}
      className={cN(
        s.textInput,
        { [s.textInputSmall]: size === 'SMALL' },
        className,
        {
          [s.hideNumberArrows]:
            input.name === 'zipCode' || input.name === 'listId',
        }
      )}
      ref={customRef}
      {...input}
    />
  );
}

export function Textarea({ children, className, label, customRef, ...input }) {
  let charLeft;
  if (input.maxLength && input.value) {
    charLeft = input.maxLength - input.value.length;
  }
  const charCount = input.value ? input.value.length : 0;
  return (
    <div>
      <textarea
        aria-label={label}
        className={cN(s.textarea, className)}
        {...input}
        ref={customRef}
      />
      {input.maxLength && charLeft < 100 && (
        <div className={s.charLeftDisplay}>
          {charCount} / {input.maxLength}
        </div>
      )}
    </div>
  );
}

export const TextInputWrapped = ({
  input,
  label,
  meta,
  placeholder,
  description,
  hide,
  theme,
  className,
  inputClassName,
  maxLength,
  min,
  max,
  hideLabel,
  explanation,
  inputMode,
  pattern,
  autoComplete,
  customRef,
  errorClassName,
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
      errorClassName={errorClassName}
      explanation={explanation}
      theme={theme}
    >
      {input.type === 'textarea' ? (
        <Textarea
          {...input}
          placeholder={placeholder}
          className={inputClassName}
          maxLength={maxLength}
          label={outputLabel}
          autoComplete={autoComplete}
          customRef={customRef}
        />
      ) : (
        <TextInput
          {...input}
          placeholder={placeholder}
          className={inputClassName}
          maxLength={maxLength}
          min={min}
          max={max}
          label={outputLabel}
          pattern={pattern}
          inputMode={inputMode}
          autoComplete={autoComplete}
          customRef={customRef}
        />
      )}
    </LabelInputErrorWrapper>
  );
};

export function TextInputInline({ children, className, ...other }) {
  return <input className={cN(s.textInputInline, className)} {...other} />;
}

export const TextInputOneLine = ({ input, label, meta, placeholder }) => (
  <label style={{ display: 'block' }}>
    <span>{label}</span>
    <TextInputInline {...input} placeholder={placeholder} />
    {meta.error && meta.touched && (
      <ValidationError>{meta.error}</ValidationError>
    )}
  </label>
);
