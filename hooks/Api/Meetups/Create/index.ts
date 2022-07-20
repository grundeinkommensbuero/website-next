/**
 *  This file holds a hook to create a meetup
 */

import CONFIG from '../../../../backend-config';
import { useState, useContext, SetStateAction } from 'react';
import AuthContext from '../../../../context/Authentication';

type State = 'error' | 'saving' | 'saved' | null;

export type CreateMeetupData = {
  locationName: string;
  description: string;
  contact: string;
  coordinates: number[];
  address: string;
  city: string;
  zipCode: string;
  type: string;
  campaignCode: string;
  startTime?: string;
  endTime?: string;
  district?: string;
  street?: string;
  number?: string;
};
export const useCreateMeetup = (): [
  State,
  (data: CreateMeetupData, isBerlin: boolean) => void
] => {
  const [state, setState] = useState<State>(null);

  //get user id  from global context
  const { userId } = useContext(AuthContext);

  return [
    state,
    (data, isBerlin) => createMeetup(userId, data, isBerlin, setState),
  ];
};

const createMeetup = async (
  userId: string,
  data: CreateMeetupData,
  isBerlin: boolean,
  setState: React.Dispatch<SetStateAction<State>>
) => {
  try {
    setState('saving');

    // Body and endpoint needs to be different for app api
    let body;
    let endpoint;
    if (isBerlin) {
      if (data.type === 'collect') {
        const now = new Date();
        const startTime = data.startTime || now.toISOString();
        const endTime =
          data.endTime ||
          new Date(
            now.getFullYear() + 1,
            now.getMonth(),
            now.getDate()
          ).toISOString();

        body = {
          action: {
            typ: 'Sammeln',
            beginn: startTime.split('.')[0], // App backend does not accept the ms part
            ende: endTime.split('.')[0],
            ort: data.district,
            longitude: data.coordinates[0],
            latitude: data.coordinates[1],
            initiativenIds: [1], // 1 is Expedition
            // Set xbge team member as default participant
            participants: [{ id: 112 }],
            details: {
              beschreibung: data.description,
              kontakt: data.contact,
              treffpunkt: data.locationName || data.address,
            },
          },
        };

        endpoint = `${CONFIG.APP_API.INVOKE_URL}/service/termine/neu`;
      } else {
        // Type list is created via different api endpoint in app backend
        body = {
          longitude: data.coordinates[0],
          latitude: data.coordinates[1],
          name: data.locationName,
          initiativenIds: [1], // 1 is Expedition
          street: data.street,
          number: data.number,
          description: data.description,
          contact: data.contact,
        };

        endpoint = `${CONFIG.APP_API.INVOKE_URL}/service/listlocations/neu`;
      }
    } else {
      body = { ...data, userId };

      endpoint = `${CONFIG.API.INVOKE_URL}/meetups`;
    }

    const request: RequestInit = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(endpoint, request);

    // App backend returns 200
    if (response.status === 201 || response.status === 200) {
      setState('saved');
    } else {
      setState('error');
    }
  } catch (error) {
    console.log('Error while saving pledge', error);
    setState('error');
  }
};
