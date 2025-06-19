import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../../context/Authentication';
import { stateToAgs } from '../../../utils/stateToAgs';
import { FinallyMessage } from '../FinallyMessage';
import SignUp, { Fields } from '../SignUp';
import { InlineButton } from '../Button';
import s from './style.module.scss';
import { useRouter } from 'next/router';

export const SmallSignup = ({
  ags,
  flag,
  loginCodeInModal = true,
  showNewsletterConsent = false,
  optionalNewsletterConsent = false,
  hideIfAuthenticated = false,
  nudgeBoxText,
}: {
  ags?: string;
  flag?: string;
  loginCodeInModal?: boolean;
  showNewsletterConsent?: boolean;
  optionalNewsletterConsent?: boolean;
  hideIfAuthenticated?: boolean;
  nudgeBoxText?: string;
}) => {
  if (!ags) {
    ags = stateToAgs.hamburg;
  }
  const { isAuthenticated, customUserData, signUserOut } =
    useContext(AuthContext);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [autoSignupEmail, setAutoSignupEmail] = useState(
    undefined as undefined | string
  );

  useEffect(() => {
    const email = router.query.email as string;
    console.log('email: ' + email);
    if (email) {
      setAutoSignupEmail(email);
    }
  }, [router.query]);

  if (!ags) {
    ags = stateToAgs.berlin;
  }

  if (success && isAuthenticated) {
    if (hideIfAuthenticated) {
      return null;
    }
    return (
      <FinallyMessage>
        <p>Vielen Dank für die Anmeldung!</p>
      </FinallyMessage>
    );
  }

  const additionalData: { [key: string]: any } = { ags };

  if (flag) {
    additionalData.store = {
      [flag]: { value: true, timestamp: new Date().toISOString() },
    };
  }

  const fields: Fields[] = ['email', 'phoneNumber'];

  if (showNewsletterConsent) {
    fields.push('nudgeBox', 'newsletterConsent');
  }

  if (
    (!ags && customUserData.newsletterConsent.value) ||
    (ags &&
      customUserData.customNewsletters?.find(
        newsletter => newsletter.ags === ags
      ))
  ) {
    return (
      <div>
        <h3>Du bist mit der Adresse {customUserData.email} angemeldet.</h3>
        <p className={s.hint}>
          Um dich mit einer anderen Adresse anzumelden, klicke bitte zuerst auf{' '}
          <InlineButton onClick={() => signUserOut()}>abmelden</InlineButton>.
        </p>
      </div>
    );
  } else {
    return (
      <SignUp
        fieldsToRender={fields}
        additionalData={additionalData}
        showHeading={false}
        smallFormMargin={true}
        postSignupAction={() => setSuccess(true)}
        loginCodeInModal={loginCodeInModal}
        optionalNewsletterConsent={optionalNewsletterConsent}
        hideIfAuthenticated={hideIfAuthenticated}
        nudgeBoxText={nudgeBoxText}
        newsletterConsent={true}
        autoSignup={true}
        initialValues={{ email: autoSignupEmail }}
      />
    );
  }
};
