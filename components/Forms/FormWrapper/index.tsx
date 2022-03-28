import React, { ReactElement } from 'react';
import s from './style.module.scss';
import cN from 'classnames';

type FormWrapperProps = {
  children: ReactElement;
  className?: string;
};

const FormWrapper = ({ children, className }: FormWrapperProps) => (
  <div className={cN(s.form, className)}>{children}</div>
);

export default FormWrapper;
