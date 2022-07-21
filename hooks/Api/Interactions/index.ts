import { SetStateAction, useContext } from 'react';
import { useState } from 'react';
import CONFIG from '../../../backend-config';
import AuthContext from '../../../context/Authentication';

// type can be different ones in the future
type InteractionType = 'pledgePackage';

export type CreateInteractionData = {
  type: InteractionType;
  campaignCode: string;
  body: string;
};

export type UpdateInteractionData = {
  id: string;
  done: boolean;
};

type Interaction = CreateInteractionData & {
  id: string;
  done?: boolean;
  createdAt: string;
};

export type InteractionWithUser = Interaction & {
  user: {
    username: string;
    profilePictures: string[];
    userId: string;
  };
};

type SavingState = 'saving' | 'saved' | 'error' | null;
type FetchingState = 'loading' | 'success' | 'error' | undefined;

export const useSaveInteraction = (): [
  SavingState,
  (data: CreateInteractionData) => void
] => {
  // we are calling useState to 1) return the state and 2) pass the setState function
  // to our saveInteraction function, so we can set the state from there
  const [state, setState] = useState<SavingState>(null);

  // Get user id and token from global context
  const { userId, token } = useContext(AuthContext);

  return [state, data => saveInteraction(userId, data, token, setState)];
};

// Function which calls the aws api to create a new interaction
const saveInteraction = async (
  userId: string,
  data: CreateInteractionData,
  token: string,
  setState: React.Dispatch<SetStateAction<SavingState>>
) => {
  try {
    setState('saving');

    // Make request to api to save interaction
    const request: RequestInit = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${CONFIG.API.INVOKE_URL}/users/${userId}/interactions`,
      request
    );

    if (response.status === 201) {
      setState('saved');
    } else {
      setState('error');
    }
  } catch (error) {
    console.log('Error', error);
    setState('error');
  }
};

export const useGetMostRecentInteractions = (): [
  FetchingState,
  InteractionWithUser[],
  (userId: string | null, limit: number, type: InteractionType) => void
] => {
  const [state, setState] = useState<FetchingState>();
  const [interactions, setInteractions] = useState<InteractionWithUser[]>([]);

  return [
    state,
    interactions,
    (userId, limit, type) =>
      getMostRecentInteractions(userId, limit, type, setState, setInteractions),
  ];
};

const getMostRecentInteractions = async (
  userId: string | null,
  limit: number,
  type: InteractionType,
  setState: React.Dispatch<SetStateAction<FetchingState | undefined>>,
  setInteractions: React.Dispatch<SetStateAction<InteractionWithUser[]>>
) => {
  try {
    setState('loading');

    // Make request to api to save interaction
    const request: RequestInit = {
      method: 'GET',
      mode: 'cors',
    };

    // TODO: change campaign code or pass it from somewhere if there are mor campaigns
    // simultaneously
    const response = await fetch(
      `${
        CONFIG.API.INVOKE_URL
      }/interactions?limit=${limit}&campaignCode=berlin-2${
        userId ? `&userId=${userId}` : ''
      }${type ? `&type=${type}` : ''}`,
      request
    );

    if (response.status === 200) {
      const { interactions } = await response.json();
      // structure: interactions: [body, timestamp, user: {profilePictures, username, city }]
      setState('success');
      setInteractions(interactions);
    } else {
      console.log('Api response not 200');
      setState('error');
    }
  } catch (error) {
    console.log('Error', error);
    setState('error');
  }
};

export const useUpdateInteraction = (): [
  SavingState,
  (data: UpdateInteractionData) => void
] => {
  // we are calling useState to 1) return the state and 2) pass the setState function
  // to our updateInteraction function, so we can set the state from there
  const [state, setState] = useState<SavingState>(null);

  // Get user id and token from global context
  const { userId, token } = useContext(AuthContext);

  return [state, data => updateInteraction(userId, data, token, setState)];
};

// Function which calls the aws api to update an existing interaction
const updateInteraction = async (
  userId: string,
  data: UpdateInteractionData,
  token: string,
  setState: React.Dispatch<SetStateAction<SavingState>>
) => {
  try {
    setState('saving');

    // Make request to api to save interaction
    const request: RequestInit = {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${CONFIG.API.INVOKE_URL}/users/${userId}/interactions/${data.id}/`,
      request
    );

    if (response.status === 204) {
      setState('saved');
    } else {
      setState('error');
    }
  } catch (error) {
    console.log('Error', error);
    setState('error');
  }
};
