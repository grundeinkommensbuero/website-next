import React from 'react';
import * as gS from '../style.module.less';
import * as s from './style.module.less';
import SignUp from '../../Forms/SignUp';

export const SignUpFlow = ({
  userData,
  compIndex,
  setCurrentElementByIndex,
}) => {
  return (
    <section className={gS.pageContainer}>
      <div className={s.signupContainer}>
        <SignUp illustration={false} />
      </div>
    </section>
  );
};
