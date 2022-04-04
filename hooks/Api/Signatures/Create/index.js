/**
 *  This file holds a hook which serves as api call to create a signature list
 *  in the backend
 */

import { useState, useContext } from 'react';
import CONFIG from '../../../../../backend-config';
import { updateUser } from '../../Users/Update';
import AuthContext from '../../../../context/Authentication';

/*
  States:
  - error
  - creating
  - created
*/

export const useCreateSignatureList = () => {
  const [state, setState] = useState();
  const [pdf, setPdf] = useState({});
  const [anonymous, setAnonymous] = useState(false);

  //get auth token from global context
  const { token, userId } = useContext(AuthContext);

  return [
    state,
    pdf,
    anonymous,
    data => {
      // If non-anonymous download
      if (!data.anonymous && userId) {
        data.token = token;
        data.userId = userId;

        return createSignatureList(data, setState, setPdf);
      }
      // If anonymous download
      setAnonymous(true);
      return createSignatureListAnonymous(data, setState, setPdf);
    },
  ];
};

//Function to create (or get) a signature list for anonymous user
//formData does not have to hold email or userId
const createSignatureListAnonymous = async (
  { campaignCode },
  setState,
  setPdf
) => {
  try {
    setState('creating');
    //handle campaign code
    const data = { campaignCode };

    //call function to make api request, returns signature list if successful (null otherwise)
    const signatureList = await makeApiCall(data);

    setState('created');
    setPdf(signatureList);
  } catch (error) {
    console.log('Error while creating anonymous signature list', error);
    setState('error');
  }
};

// Function to create (or get) a signature list
// userId is passed
const createSignatureList = async (
  { userId, email, campaignCode, userExists, token, shouldNotUpdateUser },
  setState,
  setPdf
) => {
  try {
    setState('creating');

    const data = { userId, email, campaignCode };

    // if it is not a new user, we want to update the user to set the newsletter consent
    // but only if there is a token (user has logged in to set newsletter consent)
    // and if the user did not already had a session going in
    if (userExists && token && !shouldNotUpdateUser) {
      await updateUser({ userId, newsletterConsent: true, token });
    }

    //call function to make api request, returns signature list if successful (throws error otherwise)
    const signatureList = await makeApiCall(data, userId, token);

    setState('created');
    setPdf(signatureList);
  } catch (error) {
    if (error.status === 401) {
      setState('unauthorized');
    } else {
      console.log('Error while creating signature list', error);
      setState('error');
    }
  }
};

// Function which calls our api to create a (new) signature list
// We use different endpoints: /signatures for anonymous lists, and
// /users/{userId}/signatures for personalized lists

// Returns the list {id, url} or null
const makeApiCall = async (data, userId, token) => {
  // Make api call to create new singature list and get pdf
  const request = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(data),
  };

  const endpoint = userId ? `/users/${userId}/signatures` : '/signatures';

  const response = await fetch(`${CONFIG.API.INVOKE_URL}${endpoint}`, request);
  const json = await response.json();

  // Status might also be 200 in case there already was an existing pdf
  if (response.status === 201 || response.status === 200) {
    return json.signatureList;
  }

  throw Object.assign(
    new Error(`Api did not respond with list, status is ${response.status}`),
    {
      status: response.status,
    }
  );
};
