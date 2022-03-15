import { useState } from 'react';

const USER_ID_KEY = 'user-id';

export const useLocalStorageUser = () => {
  // Reactive state for user id
  const [userId, setUserIdState] = useState(() => {
    // Initial value comes from localStorage
    try {
      if (typeof window !== 'undefined') {
        const userId = window.localStorage.getItem(USER_ID_KEY);
        return userId ? userId : undefined;
      }

      return undefined;
    } catch (err) {
      console.warn('Error querying localStorage for user-id', err);
      return undefined;
    }
  });

  // Setter function updates state and localStorage
  const setUserId = (userId: string) => {
    if (userId) {
      window.localStorage.setItem(USER_ID_KEY, userId);
    } else {
      window.localStorage.removeItem(USER_ID_KEY);
    }

    setUserIdState(userId);
  };

  return [userId, setUserId];
};
