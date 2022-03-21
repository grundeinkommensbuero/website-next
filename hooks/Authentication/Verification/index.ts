import { useState } from 'react';
import CONFIG from '../backend-config';

export const useVerification = () => {
  const [verificationState, setVerificationState] = useState('verifying');
  return [
    verificationState,
    (userId: string, token: string) =>
      confirmSignUp(userId, token, setVerificationState),
  ];
};

export type Request = {
  method: string;
  mode: RequestMode;
  headers: {
    'Content-Type': string;
    Authorization?: string;
  };
  body?: string;
};

// Amplifys Auth Class is used to send a confirmation code to verify the mail address
const confirmSignUp = async (
  userId: string,
  token: string,
  setVerificationState: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const request: Request = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    };

    const response = await fetch(
      `${CONFIG.API.INVOKE_URL}/users/${userId}/confirm`,
      request
    );

    if (response.status === 204) {
      setVerificationState('verified');
    } else if (response.status === 404) {
      setVerificationState('userNotFound');
    } else {
      setVerificationState('error');
    }
  } catch (error) {
    setVerificationState('error');
  }
};
