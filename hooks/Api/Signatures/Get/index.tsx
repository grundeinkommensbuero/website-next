/**
 *  This file holds hooks (or just one) to make api calls regarding
 *  getting data concerning signatures (e.g. count of signatures for
 *  each campaign)
 */

import { useState } from 'react';
import CONFIG from '../../../Authentication/backend-config';
import { Request } from '../../../Authentication/Verification';

/*
  States:
  - undefined
  - stats
*/

export const useSignatureCount = (): {
  [key: string]: {
    withoutMixed: number;
    withMixed: number;
    scannedByUser: number;
    computed: number;
    withoutAnonymous: number;
    withContentful: number;
  };
} | void => {
  const [stats, setStats] = useState(() => {
    if (typeof window !== 'undefined') {
      getSignatureCount().then(data => setStats(data));
    }
  });

  return stats;
};

// Hook to get signature count of a user
// Data can have either listId, userId or email
export const useSignatureCountOfUser = (): [any, any, () => void] => {
  const [stats, setStats] = useState('');

  return [
    stats,
    (data: any) => {
      getSignatureCountOfUser(data).then(data => {
        // get the most recent relevant campaing
        data.mostRecentCampaign = getMostRecentCampaign(data);

        setStats(data);
      });
    },
    () => {
      setStats('');
    },
  ];
};

// Looks though the scans of user to find out what the most recent campaign is
const getMostRecentCampaign = (data: any) => {
  if (data.receivedList.length > 0 && data.scannedByUserList.length > 0) {
    // If user has scanned AND sent list we compare what happened the most recently
    if (
      new Date(
        data.scannedByUserList[data.scannedByUserList.length - 1].timestamp
      ) > new Date(data.receivedList[data.receivedList.length - 1].timestamp)
    ) {
      return data.scannedByUserList[data.scannedByUserList.length - 1].campaign;
    } else {
      return data.receivedList[data.receivedList.length - 1].campaign;
    }
  } else if (data.scannedByUserList > 0) {
    return data.scannedByUserList[data.scannedByUserList.length - 1].campaign;
  } else if (data.receivedList > 0) {
    return data.receivedList[data.receivedList.length - 1].campaign;
  }

  return null;
};

// gets stats (count of signatures) for each campaign
const getSignatureCount = async () => {
  try {
    const request: Request = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(
      `${CONFIG.API.INVOKE_URL}/analytics/signatures`,
      request
    );

    if (response.status === 200) {
      // get stats (object) by parsing json { campaign1: {withMixed, withoutMixed}, campaign2: {...}}
      return await response.json();
    } else {
      console.log('Response is not 200', response.status);
    }
  } catch (error) {
    console.log('Error while updating signature list', error);
  }
};

// gets stats (count of signatures) for this user
// Either a list id, user id or email can be passed
// For list id it will return the count for all lists of the user
// If no param was passed, return null
type getSignatureCountOfUserArgs = {
  listId: string;
  userId: string;
  email: string;
};
const getSignatureCountOfUser = async ({
  listId,
  userId,
  email,
}: getSignatureCountOfUserArgs) => {
  try {
    const request: Request = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let queryParam = '';

    // Check, which param was passed to function
    if (listId) {
      queryParam = `listId=${listId}`;
    } else if (userId) {
      queryParam = `userId=${userId}`;
    } else if (email) {
      queryParam = `email=${email}`;
    } else {
      // None of the needed params passed
      return null;
    }

    const response = await fetch(
      `${CONFIG.API.INVOKE_URL}/analytics/signatures?${queryParam}`,
      request
    );

    if (response.status === 200) {
      // get stats (object) by parsing json { received: number, scannedByUser: number }
      return await response.json();
    } else {
      console.log('Response is not 200', response.status);
    }
  } catch (error) {
    console.log('Error while updating signature list', error);
  }
};
