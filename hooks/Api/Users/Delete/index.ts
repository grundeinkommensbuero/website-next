import { useContext } from 'react';
import CONFIG from '../../../../backend-config';
import AuthContext from '../../../../context/Authentication';
import { Request } from '../../../Authentication/Verification';

export const useDeleteUser = () => {
  const { token, userId } = useContext(AuthContext);
  if (!userId || !token) return;
  return () => {
    deleteUser(userId, token);
  };
};

// Makes api call to delete user in db, throws error if unsuccessful
const deleteUser = async (userId: string, token: string) => {
  const url = `${CONFIG.API.INVOKE_URL}/users/${userId}`;

  const request: Request = {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  };

  const response = await fetch(url, request);

  if (response.status !== 204) {
    throw new Error(`Api response was ${response.status}`);
  }
};
