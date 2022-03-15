/**
 *  This file holds hooks (or just one) to make api calls regarding
 *  getting data about a specific user
 */

import { useState, useContext } from 'react';
import CONFIG from '../../../../../backend-config';
import AuthContext from '../../../../context/Authentication';

/*
  States:
  - { state: 'loading' }
  - { state: 'success', user }
  - { state: 'notFound' }
  - { state: 'error' }
*/
export const useUserData = () => {
  const [data, setData] = useState({});

  return [
    data,
    userId => {
      setData({ state: 'loading' });
      getUser(userId).then(data => setData(data));
    },
  ];
};

// Gets data of user (username, profile pictures etc) in the form of { state, user }
// We want to return state, because user might not have been found
export const getUser = async userId => {
  try {
    const request = {
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
  const [data, setData] = useState({});
  const { token } = useContext(AuthContext);

  return [
    data,
    () => {
      setData({ state: 'loading' });
      getCurrentUser(token).then(data => setData(data));
    },
  ];
};

// Gets data of authenticated user (in comparison to getUser including all sensitive data)
// in the form of { state, user }
export const getCurrentUser = async token => {
  try {
    const request = {
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
