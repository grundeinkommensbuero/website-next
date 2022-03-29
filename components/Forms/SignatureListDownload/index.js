import React, { useEffect, useState, useContext } from 'react';
import cN from 'classnames';
import s from './style.module.scss';

import { Form, Field } from 'react-final-form';
import { TextInputWrapped } from '../TextInput';
import { validateEmail, addActionTrackingId, trackEvent } from '../../utils';
import { CTAButton, CTAButtonContainer } from '../CTAButton';
import { InlineButton } from '../Button';
import { FinallyMessage } from '../FinallyMessage';
import { useCreateSignatureList } from '../../../hooks/Api/Signatures/Create';
import { useSignUp } from '../../../hooks/Authentication';
import { EnterLoginCode } from '../../Login/EnterLoginCode';
import AuthContext from '../../../context/Authentication';
import { navigate } from 'gatsby';

const trackingCategory = 'ListDownload';

const SignatureDownloadList = ({ signaturesId }) => {
  const [state, pdf, anonymous, createPdf] = useCreateSignatureList();
  const [signUpState, userExists, signUp] = useSignUp();
  const [loginCodeRequested, setLoginCodeRequested] = useState();
  const { isAuthenticated, userId } = useContext(AuthContext);
  const iconIncognito = require('!svg-inline-loader!./incognito_violet.svg');
  const iconMail = require('!svg-inline-loader!./mail_violet.svg');

  useEffect(() => {
    // Create pdf if user has authenticated after requesting their login code.
    if (isAuthenticated && typeof loginCodeRequested !== 'undefined') {
      createPdf({
        campaignCode: signaturesId,
        userExists,
        // We only want to update the user's newsletter consent,
        // if they did not come from identified stage (loginCodeRequested = false)
        shouldNotUpdateUser: loginCodeRequested,
      });
    }
    // eslint-disable-next-line
  }, [isAuthenticated, loginCodeRequested]);

  // As soon as signature list is created we navigate to to "checkpoints" page
  // But only if download was not anonymous
  useEffect(() => {
    if (state === 'created' && pdf.url && !anonymous) {
      navigate('/unterschreiben-schritte', { state: { pdfUrl: pdf.url } });
    }
    // eslint-disable-next-line
  }, [state, pdf]);

  // After user starts sign in process or if they are identified and request the list,
  // show EnterLoginCode component
  if (
    (signUpState === 'success' || loginCodeRequested) &&
    !isAuthenticated &&
    !anonymous
  ) {
    return (
      <EnterLoginCode preventSignIn={signUpState === 'success'}>
        <p>
          Zur Verifizierung gib bitte den Code ein, den wir dir gerade in einer
          E-Mail geschickt haben. Alternativ kannst du auch eine Liste{' '}
          <InlineButton
            onClick={() => {
              createPdf({ campaignCode: signaturesId, anonymous: true });
            }}
            type="button"
          >
            hier
          </InlineButton>{' '}
          anonym herunterladen.
        </p>
      </EnterLoginCode>
    );
  }

  // Also include created state (if not anonymous) to avoid flashing of content before navigating
  if (
    state === 'creating' ||
    (state === 'created' && !anonymous) ||
    signUpState === 'loading'
  ) {
    return (
      <FinallyMessage state="progress">
        Liste wird generiert, bitte einen Moment Geduld...
      </FinallyMessage>
    );
  }

  if (state === 'error') {
    trackEvent({
      category: trackingCategory,
      action: addActionTrackingId('downloadCreationError', signaturesId),
    });

    return (
      <FinallyMessage state="error">
        Da ist was schief gegangen. Melde dich bitte bei uns{' '}
        <a href="mailto:support@expedition-grundeinkommen.de">
          support@expedition-grundeinkommen.de
        </a>
        .
      </FinallyMessage>
    );
  }

  if (state === 'created' && anonymous) {
    return (
      <FinallyMessage state="success">
        <p>
          Juhu!{' '}
          <a target="_blank" rel="noreferrer" href={pdf.url}>
            Hier
          </a>{' '}
          kannst du die Unterschriftslisten samt Leitfaden herunterladen!
        </p>
      </FinallyMessage>
    );
  }

  return (
    <>
      <Form
        onSubmit={e => {
          // If user is authenticated
          if (isAuthenticated) {
            createPdf({
              campaignCode: signaturesId,
              userExists: true,
              shouldNotUpdateUser: true,
            });
            return;
          }

          // If user is identified
          if (userId) {
            // Show EnterLoginCode
            setLoginCodeRequested(true);
            return;
          } else {
            setLoginCodeRequested(false);
          }

          // If user is not identified
          signUp({ newsletterConsent: true, ...e });
        }}
        validate={values => validate(values, userId)}
        render={({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit} className={s.form}>
              {!userId ? (
                <>
                  <p className={s.hint}>
                    Schickt mir die Unterschriftenliste, erinnert mich an das
                    Zurücksenden und haltet mich auf dem Laufenden.
                  </p>
                  <div className={s.textInputContainer}>
                    <Field
                      name="email"
                      label="E-Mail"
                      placeholder="E-Mail"
                      component={TextInputWrapped}
                      inputClassName={s.emailInput}
                    />
                  </div>
                </>
              ) : (
                <div>
                  <p>
                    Hier findest du die Unterschriftenlisten für das
                    Volksbegehren zum Download. Lade dir eine Liste herunter,
                    unterschreibe sie und schick sie an uns zurück!
                  </p>
                </div>
              )}
              <CTAButtonContainer>
                <CTAButton type="submit">Her mit den Listen</CTAButton>
              </CTAButtonContainer>

              <div className={s.iconParagraphContainer}>
                {!isAuthenticated && (
                  <>
                    <div className={s.iconParagraph}>
                      <div
                        className={cN(s.icon)}
                        dangerouslySetInnerHTML={{ __html: iconIncognito }}
                      ></div>
                      <p>
                        Du willst deine E-Mail-Adresse nicht angeben? Du kannst
                        die Liste{' '}
                        <InlineButton
                          onClick={() => {
                            createPdf({ campaignCode: signaturesId });
                          }}
                          type="button"
                        >
                          hier auch anonym herunterladen.
                        </InlineButton>{' '}
                        Allerdings können wir dich dann nicht informieren, wenn
                        deine Unterschriften bei uns eingegangen sind!
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className={s.iconParagraph}>
                <div
                  className={s.icon}
                  dangerouslySetInnerHTML={{ __html: iconMail }}
                ></div>
                <p>
                  Kein Drucker? Bei{' '}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://innn.it/demokratiefueralle"
                  >
                    innn.it
                  </a>{' '}
                  könnt ihr euch die Liste per Post schicken lassen.
                </p>
              </div>
            </form>
          );
        }}
      />
    </>
  );
};

const validate = (values, userId) => {
  const errors = {};

  if (!userId) {
    if (values.email && values.email.includes('+')) {
      errors.email = 'Zurzeit unterstützen wir kein + in E-Mails';
    }

    if (!validateEmail(values.email)) {
      errors.email = 'Wir benötigen eine valide E-Mail Adresse';
    }
  }

  return errors;
};

export default SignatureDownloadList;
