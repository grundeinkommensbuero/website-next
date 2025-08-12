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
  const [phoneNumber, setPhoneNumber] = React.useState<string | undefined>('');

  if (hide) return null;

  return (
    <LabelInputErrorWrapper
      label={!hideLabel ? label : undefined}
      meta={meta}
      className={className}
      errorClassName={errorClassName}
    >
      <div className={cN(s.phoneNumberInputContainer)}>
        <PhoneInput
          value={phoneNumber}
          onChange={val => {
            setPhoneNumber(val);
            input.onChange(val);
          }}
          international
          defaultCountry="DE"
          numberInputProps={{
            className: cN(s.phoneNumberInput, className, {
              [s.hamburg]: IS_HAMBURG_PROJECT,
            }),
          }}
        />
        {description && <div className={s.hint}>({description})</div>}
      </div>
    </LabelInputErrorWrapper>
  );
};
