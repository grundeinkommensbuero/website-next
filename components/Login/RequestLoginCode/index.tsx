import React, { useState, useContext, useEffect, ReactElement } from 'react';
import { Form, Field } from 'react-final-form';

import AuthContext from '../../../context/Authentication';
import { useSignOut } from '../../../hooks/Authentication';
import { FinallyMessage } from '../../Forms/FinallyMessage';
import { EnterLoginCode } from '../EnterLoginCode';

import FormSection from '../../Forms/FormSection';
import FormWrapper from '../../Forms/FormWrapper';
import { TextInputWrapped } from '../../Forms/TextInput';

import { validateEmail } from '../../../hooks/Authentication/validateEmail';
import s from '../style.module.scss';

import {
  CTAButtons,
  CTAButtonContainer,
  CTAButton,
} from '../../Forms/CTAButton';
import { useRouter } from 'next/router';

type RequestLoginProps = {
  children: ReactElement;
  buttonText?: string;
};

export const RequestLoginCode = ({
  children,
  buttonText = 'Einloggen',
}: RequestLoginProps) => {
  const { customUserData: userData } = useContext(AuthContext);
  const [confirmSendCode, setConfirmSendCode] = useState(false);
  const signOut = useSignOut();

  if (!confirmSendCode) {
    return (
      <FinallyMessage>
        {children ? (
          children
        ) : (
          <p>
            Du bist angemeldet als{' '}
            {userData && (userData.username || userData.email)}.
          </p>
        )}
        <CTAButtons>
          <CTAButtonContainer>
            <CTAButton onClick={() => setConfirmSendCode(true)} type="button">
              {buttonText}
            </CTAButton>
          </CTAButtonContainer>
          <CTAButtonContainer>
            <CTAButton onClick={signOut} type="button">
              Abmelden
            </CTAButton>
          </CTAButtonContainer>
        </CTAButtons>
      </FinallyMessage>
    );
  }

  // If there is a temporary email, show EnterLoginCode
  return (
    <EnterLoginCode>
      <h3 className={s.headingWhite}>Schön, dass du an Bord bist.</h3>
      <p>
        {' '}
        Um dich zu identifizieren, haben wir dir einen Code per E-Mail
        geschickt. Bitte gib diesen ein:
      </p>
    </EnterLoginCode>
  );
};

export const RequestLoginCodeWithEmail = ({
  children,
  buttonText = 'Einloggen',
}: RequestLoginProps) => {
  const { tempEmail, setTempEmail } = useContext(AuthContext);
  const router = useRouter();

  // Add event listener on url hash change
  useEffect(() => {
    window.addEventListener(
      'hashchange',
      () => setTempEmail && setTempEmail('')
    );
  }, [setTempEmail]);

  if (!tempEmail) {
    return (
      <FinallyMessage>
        <>
          {/* Custom text */}
          {children}
          {/* Form for getting email */}
          <Form
            onSubmit={e => {
              setTempEmail && setTempEmail(e.email);

              // We want to navigate to same url with hash, so we add
              // a the current url to the browser history, so we go back
              // to email form after user presses back button in login code form.
              // If the hash was already #code we want to replace the current page in the stack.
              if (window.location.hash === '#code') {
                router.replace('#code');
              } else {
                router.push('#code');
              }
            }}
            validate={e => {
              let errors: {
                email?: string;
              } = {};
              if (e.email && !validateEmail(e.email)) {
                errors.email = 'Wir benötigen eine valide E-Mail Adresse';
              }
              return errors;
            }}
            render={({ handleSubmit }) => {
              return (
                <FormWrapper>
                  <form onSubmit={handleSubmit}>
                    <FormSection>
                      <Field
                        name="email"
                        label="Email"
                        placeholder="Email"
                        type="text"
                        autoComplete="on"
                        component={TextInputWrapped as any}
                      ></Field>
                    </FormSection>

                    <CTAButtonContainer>
                      <CTAButton type="submit">
                        {buttonText || 'Abschicken'}
                      </CTAButton>
                    </CTAButtonContainer>
                  </form>
                </FormWrapper>
              );
            }}
          />
        </>
      </FinallyMessage>
    );
  }

  // If there is a temporary email, show EnterLoginCode
  return <EnterLoginCode />;
};
