import React, { useContext, useState } from 'react';
import AuthContext from '../../../context/Authentication';
import { stateToAgs } from '../../../utils/stateToAgs';
import { FinallyMessage } from '../FinallyMessage';
import SignUp from '../SignUp';

export const SmallSignup = ({
  ags,
  flag,
  loginCodeInModal = true,
}: {
  ags?: string;
  flag?: string;
  loginCodeInModal?: boolean;
}) => {
  if (!ags) {
    ags = stateToAgs.berlin;
  }

  const { isAuthenticated } = useContext(AuthContext);
  const [success, setSuccess] = useState(false);

  if (success && isAuthenticated) {
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

  return (
    <SignUp
      fieldsToRender={['email']}
      // If this is a signup for a specific collection (date and location set), that should be saved.
      // Otherwise we pass that user wants to collect in general
      additionalData={additionalData}
      showHeading={false}
      smallFormMargin={true}
      postSignupAction={() => setSuccess(true)}
      loginCodeInModal={loginCodeInModal}
    />
  );
};
