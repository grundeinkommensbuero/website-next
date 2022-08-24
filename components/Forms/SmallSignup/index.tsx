import React, { useContext, useState } from 'react';
import AuthContext from '../../../context/Authentication';
import { stateToAgs } from '../../../utils/stateToAgs';
import { FinallyMessage } from '../FinallyMessage';
import SignUp, { Fields } from '../SignUp';

export const SmallSignup = ({
  ags,
  flag,
  loginCodeInModal = true,
  showNewsletterConsent = false,
  optionalNewsletterConsent = false,
  hideIfAuthenticated = false,
}: {
  ags?: string;
  flag?: string;
  loginCodeInModal?: boolean;
  showNewsletterConsent?: boolean;
  optionalNewsletterConsent?: boolean;
  hideIfAuthenticated?: boolean;
}) => {
  if (!ags) {
    ags = stateToAgs.berlin;
  }

  const { isAuthenticated } = useContext(AuthContext);
  const [success, setSuccess] = useState(false);

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

  const fields: Fields[] = ['email'];

  if (showNewsletterConsent) {
    fields.push('newsletterConsent');
  }

  return (
    <SignUp
      fieldsToRender={fields}
      // If this is a signup for a specific collection (date and location set), that should be saved.
      // Otherwise we pass that user wants to collect in general
      additionalData={additionalData}
      showHeading={false}
      smallFormMargin={true}
      postSignupAction={() => setSuccess(true)}
      loginCodeInModal={loginCodeInModal}
      optionalNewsletterConsent={optionalNewsletterConsent}
      hideIfAuthenticated={hideIfAuthenticated}
    />
  );
};
