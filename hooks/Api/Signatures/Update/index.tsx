/**
 *  This file holds a hook (or multiple hooks) which serves as api call
 *  to update a signature list in the backend (e.g. add a count, if user scanned
 *  qr code)
 */

import React, { SetStateAction, useState } from 'react';
import CONFIG from '../../../Authentication/backend-config';
import { Request } from '../../../Authentication/Verification';

export type RequestState =
  | 'saving'
  | 'saved'
  | 'error'
  | 'listNotFound'
  | 'userNotFound'
  | 'listAndUserNotFound'
  | null;

export const useUpdateSignatureListByUser = (): [
  RequestState,
  (data: any) => Promise<void>,
  () => void
] => {
  const [state, setState] = useState<RequestState>(null);
  return [
    state,
    (data: any) => updateSignatureListByUser(data, setState),
    () => {
      setState(null);
    },
  ];
};

type updateSignatureListByUserProps = {
  listId: string;
  userId: string;
  email: string;
  count: number;
};

// function, which makes an api call to set the signature count
// for a specific list after user has scanned the qr code
const updateSignatureListByUser = async (
  { listId, userId, email, count }: updateSignatureListByUserProps,
  setState: React.Dispatch<SetStateAction<RequestState>>
) => {
  // make api call to create new singature list and get pdf
  setState('saving');

  const body = { count, userId: '', email: '' };

  // Depending on whether a user id or email was provided
  // we either send only list id or with user id or email

  if (userId) {
    body.userId = userId;
  } else if (email) {
    body.email = email;
  }

  try {
    const request: Request = {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(
      `${CONFIG.API.INVOKE_URL}/signatures/${listId}`,
      request
    );

    if (response.status === 204) {
      setState('saved');
    } else if (response.status === 404) {
      const json = await response.json();

      // errorCode is either 'listNotFound' or 'userNotFound' or 'listAndUserNotFound'
      setState(json.errorCode);
    } else {
      setState('error');
    }
  } catch (error) {
    console.log('Error while updating signature list', error);
    setState('error');
  }
};
