import CONFIG from '../../../../../backend-config';
import { useState, useContext } from 'react';
import { saveUser } from '../shared';
import AuthContext from '../../../../context/Authentication';

export const useUpdateUser = () => {
  const [state, setState] = useState();

  //get auth token from global context
  const { token, userId } = useContext(AuthContext);

  return [
    state,
    async data => {
      try {
        setState('loading');
        await updateUser({ token, userId, ...data });

        setState('updated');
      } catch (error) {
        setState('error');
        console.log('Error', error);
      }
    },
  ];
};

//Makes api call to update user in db, throws error if unsuccessful
export const updateUser = async ({ userId, token, ...data }) => {
  const url = `${CONFIG.API.INVOKE_URL}/users/${userId}`;

  const response = await saveUser({
    method: 'PATCH',
    url,
    token,
    ...data,
  });

  if (response.status !== 204) {
    throw new Error(`Api response was ${response.status}`);
  }
};
