import CONFIG from '../../../../backend-config';
import { saveUser } from '../shared';

//Makes api call to update user in db, throws error if unsuccessful
export const createUser = async ({
  newsletterConsent,
  ...data
}: {
  newsletterConsent?: boolean;
  referral: string | (string | null)[] | null;
  email: string;
  userId: string;
}) => {
  const url = `${CONFIG.API.INVOKE_URL}/users`;

  // If newsletter consent was not passed (because e.g. checkbox was not clicked),
  // set it to false
  if (typeof newsletterConsent === 'undefined') {
    newsletterConsent = false;
  }

  const response = await saveUser({
    newsletterConsent,
    method: 'POST',
    url,
    ...data,
  });

  if (response.status !== 201) {
    throw new Error(`Api response was ${response.status}`);
  }
};
