import { SetStateAction } from 'react';

const debugLog = false;

export const diffSeconds = (dt2: Date, dt1: Date) => {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  return Math.abs(Math.round(diff));
};

export const diffCount = (c2: number, c1: number) => {
  let diff = c1 - c2;
  return diff;
};

type CalcTickerValuesArgs = {
  prevTimestamp: Date;
  currTimestamp: Date;
  setTimePassedInIntervalInPercent: React.Dispatch<SetStateAction<number>>;
};

export const calcTickerValues = ({
  prevTimestamp,
  currTimestamp,
  setTimePassedInIntervalInPercent,
}: CalcTickerValuesArgs) => {
  // prepare variables for calulation of time passed in percent
  const currTime = new Date();
  const intervalLength = diffSeconds(prevTimestamp, currTimestamp);
  const timePassed = diffSeconds(currTimestamp, currTime);
  const calcTimePassed = timePassed / intervalLength;
  setTimePassedInIntervalInPercent(calcTimePassed);
};

type UpdateTickerArgs = {
  statsSummary: {
    users: number;
    municipalities?: number;
    previous?: {
      users: number;
      municipalities?: number;
    };
  };
  timePassedInIntervalInPercent: number;
  setPeopleCount: React.Dispatch<SetStateAction<number>>;
  setMunicipalityCount: React.Dispatch<SetStateAction<number>>;
  updatedSummary: number;
  setUpdatedSummary: React.Dispatch<SetStateAction<number>>;
  refreshContextStats: () => void;
};

export const updateTicker = ({
  statsSummary,
  timePassedInIntervalInPercent,
  setPeopleCount,
  setMunicipalityCount,
  updatedSummary,
  setUpdatedSummary,
  refreshContextStats,
}: UpdateTickerArgs) => {
  debugLog &&
    console.log('Percent of Interval passed:', timePassedInIntervalInPercent);
  // Get users and calculate users won in the last 15 minutes
  const prevCountUsers = statsSummary?.previous?.users || 0;
  const currCountUsers = statsSummary?.users || 0;
  const usersWonInInterval = diffCount(prevCountUsers, currCountUsers);
  const usersToAdd = Math.floor(
    usersWonInInterval * timePassedInIntervalInPercent
  );
  debugLog && console.log('Users to add:', usersToAdd);
  // Get municiplaities and calculate users won in the last 15 minutes
  const prevCountMunicipalities = statsSummary?.previous?.municipalities || 0;
  const currCountMunicipalities = statsSummary?.municipalities || 0;
  const municipalitiesWonInInterval = diffCount(
    prevCountMunicipalities,
    currCountMunicipalities
  );
  const municipalitiesToAdd = Math.floor(
    municipalitiesWonInInterval * timePassedInIntervalInPercent
  );
  debugLog && console.log('Municipalities to add:', municipalitiesToAdd);

  if (timePassedInIntervalInPercent <= 1) {
    debugLog && console.log('Setting Users to:', prevCountUsers + usersToAdd);
    setPeopleCount(prevCountUsers + usersToAdd);
    debugLog &&
      console.log(
        'Setting Municipalities to:',
        prevCountMunicipalities + municipalitiesToAdd
      );
    setMunicipalityCount(prevCountMunicipalities + municipalitiesToAdd);
    setTimeout(() => {
      setUpdatedSummary(updatedSummary + 1);
    }, 1000);
  } else {
    refreshContextStats();
  }
};

export const numberWithDots = (num = 0) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
