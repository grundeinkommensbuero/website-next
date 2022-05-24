/**
 * This file holds the hook(s) needed for the stats of municipalities
 */

import React, { SetStateAction, useState } from 'react';
import { State } from 'react-overlays/cjs/usePopper';
import { Municipality } from '../../../context/Municipality';
import CONFIG from '../../../backend-config';
import { Request } from '../../Authentication/Verification';

export type MunicipalityStats = {
  municipalities: Municipality[];
  summary?: {
    timestamp: string;
  };
  events?: [];
  timePassed?: number;
};

type GetMunicipalityStats = [
  string,
  MunicipalityStats,
  (ags?: null) => Promise<void>
];

export const useGetMunicipalityStats = (): GetMunicipalityStats => {
  const [state, setState] = useState('');
  const [stats, setStats] = useState({
    municipalities: [],
  });

  return [
    state,
    stats,
    (ags = null) => getMunicipalityStats(ags, setState, setStats),
  ];
};

type GetSingleMunicipalityStats = [
  string,
  Municipality,
  (ags?: null) => Promise<void>
];

export const useGetSingleMunicipalityStats = (): GetSingleMunicipalityStats => {
  const [state, setState] = useState<string>('');
  const [stats, setStats] = useState<Municipality>({} as Municipality);

  return [
    state,
    stats,
    (ags = null) => getMunicipalityStats(ags, setState, setStats),
  ];
};

// This function fetches the municipality stats from the backend.
// Depending on whether an ags is passed stats for just one munic. or for all is fetched.
const getMunicipalityStats = async (
  ags: string | null,
  setState: React.Dispatch<SetStateAction<string>>,
  setStats:
    | React.Dispatch<SetStateAction<Municipality>>
    | React.Dispatch<SetStateAction<{ municipalities: never[] }>>
) => {
  try {
    setState('loading');

    // Make request to api to save question
    const request: Request = {
      method: 'GET',
      mode: 'cors',
    };

    const endpoint = ags
      ? `/analytics/municipalities/${ags}`
      : '/analytics/municipalities';

    const response = await fetch(
      `${CONFIG.API.INVOKE_URL}${endpoint}`,
      request
    );

    if (response.status === 200) {
      const { data } = await response.json();
      setState('success');
      setStats(data);
    } else {
      console.log('Api response not 200');
      setState('error');
    }
  } catch (error) {
    console.log('Error', error);
    setState('error');
  }
};

// Gets data of municipality from database
export const useGetMunicipalityData = () => {
  const [state, setState] = useState('');
  const [data, setData] = useState({});

  return [
    state,
    data,
    (ags: string) => getMunicipalityData(ags, setState, setData),
  ];
};

// This function fetches the municipality data (e.g. groups, not stats) from the backend.
const getMunicipalityData = async (
  ags: string,
  setState: React.Dispatch<SetStateAction<string>>,
  setData: React.Dispatch<SetStateAction<{}>>
) => {
  try {
    setState('loading');

    // Make request to api to save question
    const request: Request = {
      method: 'GET',
      mode: 'cors',
    };

    const endpoint = `/municipalities/${ags}`;

    const response = await fetch(
      `${CONFIG.API.INVOKE_URL}${endpoint}`,
      request
    );

    if (response.status === 200) {
      const { data } = await response.json();
      setState('success');
      setData(data);
    } else {
      console.log('Api response not 200');
      setState('error');
    }
  } catch (error) {
    console.log('Error', error);
    setState('error');
  }
};
