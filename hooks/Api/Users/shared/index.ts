import { Request } from '../../../Authentication/Verification';
import { getSocialMediaReferral } from '../../../utils';

// Helper function to saveUser, either updates via patch or creates via post
export const saveUser = async ({
  token,
  url,
  method,
  ...data
}: {
  token?: string;
  url: string;
  method: string;
  ags?: string;
  newsletterConsent?: boolean;
  store?: {
    referredByUser: string | (string | null)[] | null;
  };
}) => {
  // If someone is signing up for municipality we want to check
  // if they came from a social media post from another user
  if (data.ags) {
    const referredByUser = getSocialMediaReferral();
    if (referredByUser) {
      data.store = { referredByUser };
    }
  }

  const request: Request = {
    method: method,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  // If there was an auth token passed add it to the headers
  if (token && request?.headers) {
    request.headers.Authorization = token;
  }

  return fetch(url, request);
};
