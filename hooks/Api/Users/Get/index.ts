/**
 *  This file holds hooks (or just one) to make api calls regarding
 *  getting data about a specific user
 */

import { useState, useContext } from 'react';
import CONFIG from '../../../Authentication/backend-config';
import AuthContext from '../../../../context/Authentication';
import { Request } from '../../../Authentication/Verification';

/*
  States:
  - { state: 'loading' }
  - { state: 'success', user }
  - { state: 'notFound' }
  - { state: 'error' }
*/
export const useUserData = () => {
  const [data, setData] = useState<any>({});

  return [
    data,
    (userId: string) => {
      setData({ state: 'loading' });
      getUser(userId).then(data => setData(data));
    },
  ];
};

// Gets data of user (username, profile pictures etc) in the form of { state, user }
// We want to return state, because user might not have been found
export const getUser = async (userId: string) => {
  try {
    const request: Request = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(
      `${CONFIG.API.INVOKE_URL}/users/${userId}`,
      request
    );

    if (response.status === 200) {
      const json = await response.json();
      return { state: 'success', user: json.user };
    } else if (response.status === 404) {
      return { state: 'notFound' };
    }
  } catch (error) {
    return { state: 'error' };
  }
};

export const useCurrentUserData = () => {
  const [data, setData] = useState<any>({});
  const { token } = useContext(AuthContext);

  return [
    data,
    () => {
      setData({ state: 'loading' });
      if (token) getCurrentUser(token).then(data => setData(data));
    },
  ];
};

// Gets data of authenticated user (in comparison to getUser including all sensitive data)
// in the form of { state, user }
export const getCurrentUser = async (token: string) => {
  try {
    const request: Request = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };

    const response = await fetch(`${CONFIG.API.INVOKE_URL}/users/me`, request);

    if (response.status === 200) {
      const json = await response.json();
      return { state: 'success', user: json.user };
    } else if (response.status === 401) {
      return { state: 'unauthorized' };
    }
  } catch (error) {
    return { state: 'error' };
  }
};
