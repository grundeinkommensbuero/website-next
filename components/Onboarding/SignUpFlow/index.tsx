import React from 'react';
import s from './style.module.scss';
import SignUp from '../../Forms/SignUp';
import { PageContainer } from '../PageContainer';

export const SignUpFlow = () => {
  return (
    <PageContainer>
      <SignUp isOnboarding={true} formClassName={s.signupContainer} />
    </PageContainer>
  );
};
