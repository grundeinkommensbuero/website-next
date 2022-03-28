import React, { ReactElement } from 'react';
import s from './style.module.scss';
import cN from 'classnames';

type FormSectionProps = {
  children: ReactElement;
  className?: string;
  heading?: string;
  fieldContainerClassName?: string;
};

export default function FormSection({
  children,
  className,
  heading,
  fieldContainerClassName,
}: FormSectionProps) {
  return (
    <div className={cN(className, s.container)}>
      {heading && <h4 className={s.heading}>{heading}</h4>}
      <div className={cN(s.fieldContainer, fieldContainerClassName)}>
        {children}
      </div>
    </div>
  );
}
