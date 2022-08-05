import React, { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import cN from 'classnames';
import { useUpdateUser } from '../../../hooks/Api/Users/Update';
import { useChangeEmail } from '../../../hooks/Authentication';
import {
  Button,
  InlineButton,
  PrimarySecondaryButtonContainer,
} from '../../Forms/Button';
import FormSection from '../../Forms/FormSection';
import FormWrapper from '../../Forms/FormWrapper';
import { TextInputWrapped } from '../../Forms/TextInput';
import { EnterCode } from './EnterCode';
import gS from '../style.module.scss';
import s from './style.module.scss';
import { validateEmail } from '../../../hooks/Authentication/validateEmail';
import { User } from '../../../context/Authentication';

type ChangeEmailProps = { userData: User; updateCustomUserData: () => void };

export const ChangeEmail = ({
  userData,
  updateCustomUserData,
}: ChangeEmailProps) => {
  const [tempEmail, setTempEmail] = useState('');
  const [changedEmailState, changeEmail, setChangedEmailState] =
    useChangeEmail();

  // In comparison to changeEmail this is used to change the email
  // in the dynamo database, while changeEmail starts a process to change it in cognito
  const [updateEmailState, updateEmail] = useUpdateUser();

  useEffect(() => {
    if (updateEmailState === 'updated') {
      updateCustomUserData();
      setChangedEmailState('');
    }

    if (updateEmailState === 'error') {
      setChangedEmailState('');
    }
    // eslint-disable-next-line
  }, [updateEmailState]);

  // This callback is passed to EnterCode component and is called,
  // when validation of new email was successful
  const onAnswerChallengeSuccess = () => {
    updateEmail({ email: tempEmail });
  };

  return (
    <>
      <h4 className={gS.optionSectionHeading}>E-Mail-Adresse ändern</h4>
      <div className={s.optionSectionDescription}>
        {changedEmailState === 'loading' && (
          <span>
            <span className={gS.loading}></span>
            <b className={gS.loadingMsg}>Verifizierungsmail wird verschickt</b>
          </span>
        )}

        {changedEmailState === 'success' && updateEmailState !== 'loading' && (
          <>
            <p>
              <b className={gS.infoMsg}>
                Um dich zu identifizieren, haben wir dir einen Code an deine
                neue E-Mail-Adresse geschickt.
              </b>
            </p>
            <EnterCode onAnswerChallengeSuccess={onAnswerChallengeSuccess} />
          </>
        )}

        {updateEmailState === 'loading' && (
          <span>
            <span className={gS.loading}></span>
            <b className={gS.loadingMsg}>Speichern</b>
          </span>
        )}

        {changedEmailState === 'error' && <ErrorMessage />}

        {(!changedEmailState || changedEmailState === 'emailExists') && (
          <>
            <Form
              onSubmit={e => {
                setTempEmail(e.email);
                changeEmail(e.email);
              }}
              initialValues={{ email: tempEmail || userData.email }}
              validate={(values: { email: string }) =>
                validate(values, userData.email)
              }
              render={({ handleSubmit, form, dirtyFields, modified }) => {
                return (
                  <FormWrapper>
                    <form onSubmit={handleSubmit}>
                      <FormSection>
                        <Field
                          name="email"
                          placeholder="E-Mail-Adresse"
                          type="text"
                          component={TextInputWrapped as any}
                          inputClassName={cN({
                            [s.inputHighlighted]: dirtyFields.email,
                          })}
                        ></Field>

                        <>
                          {dirtyFields.email && (
                            <PrimarySecondaryButtonContainer>
                              <InlineButton
                                onClick={() => {
                                  form.reset();
                                  form.resetFieldState('email');
                                }}
                                type="button"
                              >
                                Abbrechen
                              </InlineButton>
                              <Button type="submit">Speichern</Button>
                            </PrimarySecondaryButtonContainer>
                          )}
                        </>

                        <>
                          {' '}
                          {updateEmailState === 'updated' &&
                            modified &&
                            !modified.email && (
                              <span>
                                <b className={gS.infoMsg}>
                                  E-Mail-Adresse erfolgreich geändert
                                </b>
                              </span>
                            )}
                        </>

                        <>
                          {changedEmailState === 'emailExists' && (
                            <span>
                              <b className={gS.infoMsg}>
                                Diese E-Mail-Adresse existiert bereits.
                              </b>
                            </span>
                          )}
                        </>

                        {updateEmailState === 'error' ? (
                          <ErrorMessage />
                        ) : (
                          <></>
                        )}
                      </FormSection>
                    </form>
                  </FormWrapper>
                );
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

type FormErrors = {
  email?: string;
};

const validate = (values: { email: string }, oldEmail: string) => {
  const errors: FormErrors = {};

  if (values.email && values.email.includes('+')) {
    errors.email = 'Zurzeit unterstützen wir kein + in E-Mails';
  }

  if (values.email && !validateEmail(values.email)) {
    errors.email = 'Wir benötigen eine valide E-Mail-Adresse';
  }

  if (!values.email) {
    errors.email = 'Wir benötigen eine valide E-Mail-Adresse';
  }

  if (values.email === oldEmail) {
    errors.email = 'Bitte gib eine neue E-Mail-Adresse ein.';
  }

  return errors;
};

export const ErrorMessage = () => (
  <span>
    <b className={gS.infoMsg}>
      Da ist was schief gegangen. Melde dich bitte bei{' '}
      <a href="mailto:support@expedition-grundeinkommen.de">
        support@expedition-grundeinkommen.de
      </a>
    </b>
  </span>
);
