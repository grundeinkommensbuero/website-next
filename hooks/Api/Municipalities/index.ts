/**
 * This file holds the hook(s) needed for the stats of municipalities
 */

import React, { SetStateAction, useState } from 'react';
import { State } from 'react-overlays/cjs/usePopper';
import { Municipality } from '../../../context/Municipality';
import CONFIG from '../../../backend-config';
import { Request } from '../../Authentication/Verification';

export type MunicipalityStats = {
  municipalities: { ags: string; signups: number }[];
  summary?: {
    timestamp: string;
    users: number;
    municiplaities: number;
    previous: {
      timestamp: string;
      users: number;
      municiplaities: number;
    };
  };
  events?: [];
  timePassed?: number;
};

type GetMunicipalityStats = [string, MunicipalityStats, () => void];

export const useGetMunicipalityStats = (): GetMunicipalityStats => {
  const [state, setState] = useState('');
  const [stats, setStats] = useState({
    municipalities: [],
  });

  return [
    state,
    stats,
    () => {
      setState('loading');
      getMunicipalityStats().then(stats => {
        if (!stats) {
          setState('error');
        } else {
          setStats(stats);
          setState('success');
        }
      });
    },
  ];
};

type GetSingleMunicipalityStats = [string, Municipality, (ags?: null) => void];

export const useGetSingleMunicipalityStats = (): GetSingleMunicipalityStats => {
  const [state, setState] = useState<string>('');
  const [stats, setStats] = useState<Municipality>({} as Municipality);

  return [
    state,
    stats,
    (ags = null) => {
      setState('loading');
      getMunicipalityStats(ags).then(stats => {
        if (!stats) {
          setState('error');
        } else {
          setStats(stats);
          setState('success');
        }
      });
    },
  ];
};

// This function fetches the municipality stats from the backend.
// Depending on whether an ags is passed stats for just one munic. or for all is fetched.
export const getMunicipalityStats = async (ags?: string | null) => {
  try {
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
      return data;
    } else {
      console.log('Api response not 200');
      return null;
    }
  } catch (error) {
    console.log('Error', error);
    return null;
  }
};

// Gets data of municipality from database
export const useGetMunicipalityData = () => {
  const [state, setState] = useState('');
  const [data, setData] = useState({});

  return [
    state,
    data,
    (ags: string) => {
      setState('loading');

      getMunicipalityData(ags).then(data => {
        if (!data) {
          setState('error');
        } else {
          setData(data);
          setState('success');
        }
      });
    },
  ];
};

// This function fetches the municipality data (e.g. groups, not stats) from the backend.
export const getMunicipalityData = async (ags?: string | null) => {
  try {
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
      return data;
    } else {
      console.log('Api response not 200');
      return null;
    }
  } catch (error) {
    console.log('Error', error);
    return null;
  }
};
