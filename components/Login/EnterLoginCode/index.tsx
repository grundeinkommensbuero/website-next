import React, { useState, useEffect, useContext, ReactElement } from 'react';
import { Form, Field } from 'react-final-form';

import AuthContext from '../../../context/Authentication';
import { useAnswerChallenge, useSignIn } from '../../../hooks/Authentication';

import FormSection from '../../Forms/FormSection';
import FormWrapper from '../../Forms/FormWrapper';
import { FinallyMessage } from '../../Forms/FinallyMessage';
import { TextInputWrapped } from '../../Forms/TextInput';
import { InlineButton } from '../../Forms/Button';
import { CTAButtonContainer, CTAButton } from '../../Forms/CTAButton';
import s from '../style.module.scss';
import { OnboardingModalContext } from '../../../context/OnboardingModal';
import { ColorScheme } from '../../Section';
import PsstIcon from '../icon-psst.svg';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

type EnterLoginCodeProps = {
  children?: ReactElement | ReactElement[] | string;
  preventSignIn?: boolean;
  buttonText?: string;
  onAnswerChallengeSuccess?: () => void;
  colorScheme?: ColorScheme;
  loadingColorScheme?: ColorScheme;
  wrongCodeMessage?: ReactElement | string;
  inputClassName?: string;
};

export const EnterLoginCode = ({
  children,
  preventSignIn,
  buttonText,
  onAnswerChallengeSuccess,
  colorScheme,
  loadingColorScheme,
  wrongCodeMessage,
  inputClassName,
}: EnterLoginCodeProps) => {
  const { setShowModal } = useContext(OnboardingModalContext);

  const { tempEmail, setTempEmail, isAuthenticated } = useContext(AuthContext);
  const [answerChallengeState, setCode, setAnswerChallengeState] =
    useAnswerChallenge();
  const [signInState, startSignIn] = useSignIn();
  const [triggerMinuteTimer, setTriggerOneMinuteTimer] = useState(0);
  const [timerCounter, setTimerCounter] = useState(0);

  useEffect(() => {
    // We don't want to start sign in again, if flag is set
    // (we might already have started sign in outside of component)
    if (!preventSignIn) {
      startSignIn();
    }
  }, []);

  useEffect(() => {
    if (answerChallengeState === 'success' && isAuthenticated) {
      if (onAnswerChallengeSuccess) {
        onAnswerChallengeSuccess();
      }
    } else if (answerChallengeState === 'restartSignIn') {
      // We want to send a new code by starting sign in again
      startSignIn();
    }
  }, [answerChallengeState, isAuthenticated]);

  useEffect(() => {
    countdown();
  }, [triggerMinuteTimer]);

  const countdown = () => {
    let seconds = 60;
    function tick() {
      seconds--;
      setTimerCounter(seconds);
      if (seconds > 0) {
        setTimeout(tick, 1000);
      }
    }
    tick();
  };

  if (answerChallengeState === 'loading' || signInState === 'loading') {
    return (
      <FinallyMessage colorScheme={loadingColorScheme || colorScheme} loading>
        Einen Moment bitte...
      </FinallyMessage>
    );
  }

  if (answerChallengeState === 'success') {
    return (
      <FinallyMessage colorScheme={loadingColorScheme || colorScheme}>
        Erfolgreich identifiziert.
      </FinallyMessage>
    );
  }

  if (signInState === 'userNotFound') {
    return (
      <FinallyMessage colorScheme={colorScheme}>
        <p>
          Oh! Es scheint, diese Email-Addresse ist noch nicht bei uns
          registriert.{' '}
          <InlineButton
            aria-label="Registrieren"
            onClick={() => setShowModal(true)}
          >
            Hier kannst du dich neu registrieren.
          </InlineButton>
        </p>

        <p>Oder hast du deine Email-Adresse falsch eingegeben?</p>

        <CTAButtonContainer>
          <CTAButton
            onClick={() => {
              setTempEmail && setTempEmail('');
            }}
          >
            Nochmal versuchen
          </CTAButton>
        </CTAButtonContainer>
      </FinallyMessage>
    );
  }

  return (
    <FinallyMessage colorScheme={colorScheme}>
      <>
        {answerChallengeState === 'wrongCode' &&
          (wrongCodeMessage || (
            <p>
              Der eingegebene Code ist falsch oder bereits abgelaufen. Bitte
              überprüfe die Email erneut oder fordere unten einen neuen Code an.
            </p>
          ))}

        {(answerChallengeState === 'resentCode' ||
          answerChallengeState === 'restartSignIn') && (
          <p>
            Der Code wurde erneut per E-Mail{' '}
            {tempEmail ? ` (${tempEmail})` : ''} geschickt.
          </p>
        )}

        {!answerChallengeState && (
          <>
            {children ? (
              children
            ) : (
              <>
                {IS_BERLIN_PROJECT && (
                  <PsstIcon alt="Illustration eines Geheimnisses" />
                )}
                <h2>Psst... Ein Geheimnis!</h2>
              </>
            )}
          </>
        )}
        <Form
          onSubmit={e => {
            setCode(e.code);
          }}
          validate={values => {
            if (!values.code)
              return { code: 'Bitte gib den Code aus der E-Mail an' };
            return {};
          }}
          render={({ handleSubmit }) => {
            return (
              <FormWrapper>
                <form onSubmit={handleSubmit}>
                  <FormSection className={s.loginForm}>
                    <Field
                      name="code"
                      label="Geheimer Code"
                      placeholder="Geheimer Code"
                      type="text"
                      autoComplete="off"
                      component={TextInputWrapped as any}
                      inputClassName={inputClassName}
                    ></Field>
                  </FormSection>

                  <CTAButtonContainer className={s.buttonContainer}>
                    <CTAButton type="submit">
                      {buttonText ? buttonText : 'Abschicken'}
                    </CTAButton>
                  </CTAButtonContainer>
                </form>
              </FormWrapper>
            );
          }}
        />
        {!answerChallengeState && !children && (
          <>
            <p>
              Zu deiner Sicherheit haben wir dir per E-Mail einen geheimen Code
              geschickt. Schau mal in dein Postfach!{' '}
            </p>
            {tempEmail && <p>Deine Email: {tempEmail}</p>}
          </>
        )}
        <p>
          Falls wir dich schon kennen, können wir dich damit identifizieren. Und
          falls du neu bei uns bist, brauchen wir den Code als Bestätigung, dass
          du wirklich E-Mails an die angegebene Adresse erhalten möchtest.
        </p>
        {timerCounter === 0 ? (
          <InlineButton
            type="button"
            onClick={() => {
              setAnswerChallengeState(undefined);
              setCode('resendCode');
              setTriggerOneMinuteTimer(triggerMinuteTimer + 1);
            }}
          >
            Code erneut senden
          </InlineButton>
        ) : (
          <div>
            <p className={s.counterDescription}>
              Wenn du den Code nicht erhalten hast, kannst du in {timerCounter}{' '}
              {timerCounter !== 1 ? 'Sekunden' : 'Sekunde'} den Code erneut
              anfordern.
            </p>
          </div>
        )}
        <br />
        <p>
          <b>Dein Code ist 20 Minuten lang gültig. </b>
        </p>
      </>
    </FinallyMessage>
  );
};
