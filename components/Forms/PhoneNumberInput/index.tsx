import React from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import PhoneInput from 'react-phone-number-input';
import LabelInputErrorWrapper from '../LabelInputErrorWrapper';

const IS_HAMBURG_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Hamburg';

type Props = {
  input: any;
  meta: any;
  label?: string;
  description?: string;
  hide?: boolean;
  className?: string;
  errorClassName?: string;
  hideLabel?: boolean;
};

export const PhoneNumberInput = ({
  input,
  meta,
  label,
  description,
  hide,
  className,
  errorClassName,
  hideLabel,
}: Props) => {
  if (hide) return null;
  const [phoneNumber, setPhoneNumber] = React.useState<string | undefined>('');
  const outputLabel = description ? `${label} (${description})` : label;

  return (
    <LabelInputErrorWrapper
      label={!hideLabel ? outputLabel : undefined}
      meta={meta}
      className={className}
      errorClassName={errorClassName}
    >
      <PhoneInput
        value={phoneNumber}
        onChange={val => {
          setPhoneNumber(val);
          input.onChange(val);
        }}
        international
        defaultCountry="DE"
        className={cN(s.phoneInput)}
        numberInputProps={{
          className: cN(s.phoneNumberInput, className, {
            [s.hamburg]: IS_HAMBURG_PROJECT,
          }),
        }}
      />
    </LabelInputErrorWrapper>
  );
};
