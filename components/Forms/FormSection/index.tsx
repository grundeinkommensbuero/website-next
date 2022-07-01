import React, { ReactElement } from 'react';
import s from './style.module.scss';
import cN from 'classnames';

type FormSectionProps = {
  children: ReactElement | ReactElement[];
  className?: string;
  heading?: string;
  fieldContainerClassName?: string;
  smallMargin?: boolean;
};

export default function FormSection({
  children,
  className,
  heading,
  fieldContainerClassName,
  smallMargin,
}: FormSectionProps) {
  return (
    <div
      className={cN(className, s.container, { [s.smallMargin]: smallMargin })}
    >
      {heading && <h4 className={s.heading}>{heading}</h4>}
      <div className={cN(s.fieldContainer, fieldContainerClassName)}>
        {children}
      </div>
    </div>
  );
}
