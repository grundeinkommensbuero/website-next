import React, { useEffect, useState, useContext, ReactElement } from 'react';
import cN from 'classnames';
import s from './style.module.scss';

import { Form, Field } from 'react-final-form';
import { TextInputWrapped } from '../Forms/TextInput';
import { CTAButton, CTAButtonContainer } from '../Forms/CTAButton';
import { InlineButton } from '../Forms/Button';
import { FinallyMessage } from '../Forms/FinallyMessage';
import AuthContext from '../../context/Authentication';
import { useRouter } from 'next/router';
import { useCreateSignatureList } from '../../hooks/Api/Signatures/Create/index';
import { useSignUp } from '../../hooks/Authentication';
import { EnterLoginCode } from '../Login/EnterLoginCode';
import { validateEmail } from '../../hooks/Authentication/validateEmail';
import IncognitoIcon from './incognito_violet.svg';
import IncognitoIconBerlin from './incognito-berlin.svg';
import MailIcon from './mail_violet.svg';
import MailIconBerlin from './mail-berlin.svg';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

const IncognitoIconComponent = IS_BERLIN_PROJECT
  ? IncognitoIconBerlin
  : IncognitoIcon;

const MailIconComponent = IS_BERLIN_PROJECT ? MailIconBerlin : MailIcon;

type ListDownloadProps = { signaturesId: string };

type FormValues = { email: string };

type FormErrors = { email?: string };

const ListDownload = ({ signaturesId }: ListDownloadProps) => {
  const [state, pdf, anonymous, createPdf] = useCreateSignatureList();
  const [signUpState, userExists, signUp] = useSignUp();
  const [loginCodeRequested, setLoginCodeRequested] = useState<
    boolean | undefined
  >();
  const { isAuthenticated, userId } = useContext(AuthContext);
  const router = useRouter();

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
  }, [isAuthenticated, loginCodeRequested]);

  // As soon as signature list is created we navigate to to "checkpoints" page
  // But only if download was not anonymous
  useEffect(() => {
    if (state === 'created' && pdf.url && !anonymous) {
      router.push({
        pathname: '/unterschreiben-schritte',
        query: { pdfUrl: pdf.url },
      });
    }
  }, [state, pdf]);

  // After user starts sign in process or if they are identified and request the list,
  // show EnterLoginCode component
  if (
    (signUpState === 'success' || loginCodeRequested) &&
    !isAuthenticated &&
    !anonymous
  ) {
    return (
      <EnterLoginCode
        preventSignIn={signUpState === 'success'}
        wrongCodeMessage={
          <>
            <p>
              Der eingegebene Code ist falsch oder bereits abgelaufen. Bitte
              überprüfe die Email erneut oder fordere unten einen neuen Code an.
            </p>
            <p>
              Du kannst auch eine Liste{' '}
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
          </>
        }
      >
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
      <FinallyMessage loading>
        Liste wird generiert, bitte einen Moment Geduld...
      </FinallyMessage>
    );
  }

  if (state === 'error') {
    return (
      <FinallyMessage>
        <>
          Da ist was schief gegangen. Melde dich bitte bei{' '}
          <a href="mailto:support@expedition-grundeinkommen.de">
            support@expedition-grundeinkommen.de
          </a>
          .
        </>
      </FinallyMessage>
    );
  }

  if (state === 'created' && anonymous) {
    return (
      <FinallyMessage>
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

          console.log('about to signup');
          // If user is not identified
          signUp({ newsletterConsent: true, ...e });
        }}
        validate={(values: FormValues) => validate(values, userId)}
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
                      component={TextInputWrapped as any}
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
                      <IncognitoIconComponent className={cN(s.icon)} />
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
                <MailIconComponent className={s.icon} />
                <p>
                  Kein Drucker? Lade Dir deine Unterschriftenliste mit einem
                  Briefumschlag zum Selbstfalten auf{' '}
                  <a
                    href={'https://innn.it/Volksentscheid-Grundeinkommen'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    innn.it
                  </a>{' '}
                  herunter. Einfach ausfüllen, unterschreiben und zurücksenden.
                  Das Porto wird übernommen.
                </p>
              </div>
            </form>
          );
        }}
      />
    </>
  );
};

const validate = (values: FormValues, userId: string) => {
  const errors: FormErrors = {};

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

export default ListDownload;
