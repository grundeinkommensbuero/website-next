import React, { ReactElement, RefObject } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import LabelInputErrorWrapper from '../LabelInputErrorWrapper';
import { ValidationError } from '../ValidationError';

export type InputSize = 'SMALL';

type TextInputProps = {
  children?: ReactElement | ReactElement[] | HTMLCollection;
  className?: string;
  label?: string;
  size?: InputSize;
  customRef?: RefObject<any>;
  name?: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  onKeyDown?: any;
  onBlur?: any;
} & InputProps;

export function TextInput({
  children,
  className,
  label,
  size,
  customRef,
  onChange,
  value,
  disabled,
  ...input
}: TextInputProps) {
  return (
    <input
      onFocus={e => {
        if (e.target.autocomplete) {
          e.target.autocomplete = 'none';
        }
      }}
      onChange={e => onChange && onChange(e)}
      aria-label={label}
      type={'search'}
      value={value}
      className={cN(
        s.textInput,
        { [s.textInputSmall]: size === 'SMALL' },
        { [s.disabled]: disabled },
        className,
        {
          [s.hideNumberArrows]:
            input.name === 'zipCode' || input.name === 'listId',
        }
      )}
      ref={customRef}
      {...input}
      disabled={disabled}
    />
  );
}

export function Textarea({
  children,
  className,
  label,
  customRef,
  disabled,
  ...input
}: any) {
  let charLeft;
  if (input.maxLength && input.value) {
    charLeft = input.maxLength - input.value.length;
  }
  const charCount = input.value ? input.value.length : 0;
  return (
    <div>
      <textarea
        aria-label={label}
        className={cN(s.textarea, className, { [s.disabled]: disabled })}
        {...input}
        ref={customRef}
        disabled={disabled}
      />
      {input.maxLength && charLeft && charLeft < 100 && (
        <div className={s.charLeftDisplay}>
          {charCount} / {input.maxLength}
        </div>
      )}
    </div>
  );
}

type InputProps = {
  label?: string;
  meta?: {
    error: string;
    touched: boolean;
  };
  placeholder: string;
  description?: string;
  hide?: string;
  theme?: string;
  className?: string;
  inputClassName?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  hideLabel?: boolean;
  explanation?: string;
  inputMode?:
    | 'search'
    | 'text'
    | 'email'
    | 'tel'
    | 'url'
    | 'none'
    | 'numeric'
    | 'decimal'
    | undefined;
  pattern?: string;
  autoComplete?: string;
  customRef?: RefObject<any>;
  errorClassName?: string;
  disabled?: boolean;
};

type WrappedTextInputProps = {
  input: HTMLInputElement;
} & InputProps;

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
  disabled,
}: WrappedTextInputProps) => {
  if (hide) {
    return null;
  }
  const outputLabel = description ? `${label} (${description})` : label;
  return (
    <LabelInputErrorWrapper
      label={!hideLabel ? outputLabel : undefined}
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
          disabled={disabled}
        />
      ) : (
        <TextInput
          {...input}
          size={undefined}
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
          disabled={disabled}
        />
      )}
    </LabelInputErrorWrapper>
  );
};

type TextInputInlineProps = {
  children?: ReactElement;
  className?: string;
  placeholder: string;
  other?: any;
};

export function TextInputInline({
  children,
  className,
  placeholder,
  ...other
}: TextInputInlineProps) {
  return <input className={cN(s.textInputInline, className)} {...other} />;
}

type TextInputOneLineProps = {
  input: InputProps;
  label: string;
  meta: {
    error: string;
    touched: boolean;
  };
  placeholder: string;
};

export const TextInputOneLine = ({
  input,
  label,
  meta,
  placeholder,
}: TextInputOneLineProps) => (
  <label style={{ display: 'block' }}>
    <span>{label}</span>
    <TextInputInline {...input} placeholder={placeholder} />
    {meta.error && meta.touched && (
      <ValidationError>{meta.error}</ValidationError>
    )}
  </label>
);
