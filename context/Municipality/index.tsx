import React, {
  useState,
  useEffect,
  SetStateAction,
  ReactElement,
} from 'react';
import {
  useGetMunicipalityStats,
  useGetMunicipalityData,
  MunicipalityStats,
  useGetSingleMunicipalityStats,
} from '../../hooks/Api/Municipalities';

import municipalities from '../../data/municipalitiesForMap.json';
import { hasKey } from '../../utils/hasKey';

export type Municipality = {
  ags: string;
  name: string;
  slug: string;
  signups?: number;
  percent?: number;
  goal?: number;
  isQualifying?: boolean;
  isQualified?: boolean;
  isCollecting?: boolean;
  event?: { signups: [number, number] };
  grewByPercent?: number;
  population?: number;
  zipCodes?: string[];
  nameUnique?: string;
};

type MunicipalitsStatsSummary = {};

type MunicipalityContentfulState =
  | 'noMunicipality'
  | 'collecting'
  | 'qualified'
  | 'qualifying';

type MunicipalityContext = {
  isMunicipality: boolean;
  setIsMunicipality: React.Dispatch<SetStateAction<boolean>>;
  municipality: Municipality | null;
  setMunicipality: (municipality: Municipality) => void;
  municipalityContentfulState: MunicipalityContentfulState;
  allMunicipalityStats: MunicipalityStats;
  allMunicipalityStatsState: string;
  singleMunicipalityStats: {};
  singleMunicipalityStatsState: string;
  statsSummary: MunicipalitsStatsSummary | null;
  municipalitiesGoalSignup: Municipality[];
  leaderboardSegments: {};
  statsInDays: number;
  refreshContextStats: () => void;
};

export const MunicipalityContext = React.createContext<MunicipalityContext>({
  isMunicipality: false,
  setIsMunicipality: () => {},
  municipality: {
    ags: '',
    name: '',
    slug: '',
  },
  setMunicipality: () => {},
  municipalityContentfulState: 'noMunicipality',
  allMunicipalityStats: {
    municipalities: [],
  },
  allMunicipalityStatsState: '',
  singleMunicipalityStats: {
    municipalities: [],
  },
  singleMunicipalityStatsState: '',
  statsSummary: {},
  municipalitiesGoalSignup: [],
  leaderboardSegments: {},
  statsInDays: 0,
  refreshContextStats: () => {},
});

type MunicipalityProviderProps = {
  children: ReactElement | ReactElement[];
};

type Summary = {
  timestamp: string;
};

export const MunicipalityProvider = ({
  children,
}: MunicipalityProviderProps) => {
  const [isMunicipality, setIsMunicipality] = useState<boolean>(false);
  const [municipality, setMunicipalityState] = useState<Municipality | null>(
    null
  );
  const [statsSummary, setStatsSummary] = useState<Summary | null>(null);
  const [municipalitiesGoalSignup, setMunicipalitiesGoalSignup] = useState<
    Municipality[]
  >([]);
  const [municipalitiesInObject, setMunicipalitiesInObject] = useState<{
    [key: string]: MunicipalityWithEvent;
  }>({});
  const [leaderboardSegments, setLeaderboardSegments] = useState({});
  const [statsInDays, setStatsInDays] = useState<number>(0);

  // Add the Signups and percentage to the municipality object
  const setMunicipality = (municipality: Municipality) => {
    let municipalityForContext = municipality;
    if (allMunicipalityStats?.municipalities && municipality?.ags) {
      const foundMunicipality = allMunicipalityStats.municipalities.find(
        (m: Municipality) => m.ags === municipality.ags
      );
      if (foundMunicipality?.signups && municipality?.goal) {
        municipalityForContext = {
          signups: foundMunicipality.signups,
          percent: Math.round(
            (foundMunicipality.signups / municipality.goal) * 100
          ),
          ...municipality,
        };
      } else {
        municipalityForContext = {
          signups: 0,
          percent: 0,
          ...municipality,
        };
      }
    }
    setMunicipalityState(municipalityForContext);
  };

  // Stats for all municipalities
  const [
    allMunicipalityStatsState,
    allMunicipalityStats,
    getAllMunicipalityStats,
  ] = useGetMunicipalityStats();

  // Stats for just one municipality, will be set if a municipality is set
  const [
    singleMunicipalityStatsState,
    singleMunicipalityStats,
    getSingleMunicipalityStats,
  ] = useGetSingleMunicipalityStats();

  // Data for just one municipality, will be set if a municipality is set
  const [, singleMunicipalityData, getSingleMunicipalityData] =
    useGetMunicipalityData();

  const [municipalityContentfulState, setMunicipalityContentfulState] =
    useState<MunicipalityContentfulState>('noMunicipality');

  // Get general municipality stats (of all munics)
  useEffect(() => {
    getAllMunicipalityStats();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      municipality &&
      singleMunicipalityStats?.signups &&
      singleMunicipalityStats?.goal
    ) {
      const isQualifying =
        singleMunicipalityStats.signups < singleMunicipalityStats.goal;
      const isQualified =
        singleMunicipalityStats.signups >= singleMunicipalityStats.goal;
      // TODO: API Call
      const isCollecting = false;

      setMunicipality({
        ...municipality,
        ...singleMunicipalityStats,
        isQualifying,
        isQualified,
        isCollecting,
      });

      if (isCollecting) {
        setMunicipalityContentfulState('collecting');
      } else if (isQualified) {
        setMunicipalityContentfulState('qualified');
      } else if (isQualifying) {
        setMunicipalityContentfulState('qualifying');
      }
    }
    // eslint-disable-next-line
  }, [singleMunicipalityStats]);

  useEffect(() => {
    if (allMunicipalityStats?.summary?.timestamp) {
      setStatsSummary(allMunicipalityStats.summary);
    }
  }, [allMunicipalityStats]);

  type MunicipalityWithEvent = {
    name: string;
    goal: number;
    population: number;
    slug: string;
    event?: {
      ags: string;
      signups: [number, number];
    };
  };

  useEffect(() => {
    // Create Object with raw municipality data for faster reference
    const municipalityObject: { [key: string]: MunicipalityWithEvent } =
      municipalities.reduce(
        (
          muniObj: {
            [key: string]: MunicipalityWithEvent;
          },
          municipality
        ) => {
          const objKey = municipality.ags.toString();
          if (hasKey(muniObj, objKey)) {
            muniObj[objKey] = {
              name: municipality.name,
              goal: municipality.goal,
              population: municipality.population,
              slug: municipality.slug,
            };
          }
          return muniObj;
        },
        {}
      );
    // When there are events, add them to municipality key
    if (allMunicipalityStats.events) {
      allMunicipalityStats.events.forEach(
        (e: { ags: string; signups: [number, number] }) => {
          municipalityObject[e.ags.toString()] = {
            event: e,
            ...municipalityObject[e.ags.toString()],
          };
        }
      );
    }
    setMunicipalitiesInObject(municipalityObject);
  }, [allMunicipalityStats]);

  useEffect(() => {
    if (municipality) {
      setMunicipality({ ...municipality, ...singleMunicipalityData });
    }
    // eslint-disable-next-line
  }, [singleMunicipalityData]);

  useEffect(() => {
    // Find all municipalities with signups and goal
    const municipalitiesWithGoalAndSignups: Municipality[] = [];
    if ('municipalities' in allMunicipalityStats) {
      allMunicipalityStats.municipalities.forEach(municipality => {
        if (
          municipality.ags.toString() in municipalitiesInObject &&
          municipality?.signups
        ) {
          const fullMunicipality = {
            ags: municipality.ags,
            signups: municipality.signups,
            percent: Math.round(
              (municipality.signups /
                municipalitiesInObject[municipality.ags.toString()].goal) *
                100
            ),
            ...municipalitiesInObject[municipality.ags.toString()],
          };
          municipalitiesWithGoalAndSignups.push(fullMunicipality);
        }
      });
      municipalitiesWithGoalAndSignups.sort((a, b) => {
        if (a.percent && b.percent) {
          return b.percent - a.percent;
        }
        return 0;
      });
      setMunicipalitiesGoalSignup(municipalitiesWithGoalAndSignups);
    }
    // eslint-disable-next-line
  }, [municipalitiesInObject]);

  useEffect(() => {
    const segments: {
      hot: Municipality[];
      smallMunicipalities: Municipality[];
      largeMunicipalities: Municipality[];
      qualified: Municipality[];
    } = {
      hot: [],
      smallMunicipalities: [],
      largeMunicipalities: [],
      qualified: [],
    };
    municipalitiesGoalSignup.forEach(municipality => {
      if (
        'event' in municipality &&
        municipality?.event?.signups &&
        municipality?.goal
      ) {
        const beforePercent =
          (municipality.event.signups[0] / municipality.goal) * 100;
        const afterPercent =
          (municipality.event.signups[1] / municipality.goal) * 100;
        municipality.grewByPercent =
          Math.round((afterPercent - beforePercent) * 100) / 100;
        segments.hot.push(municipality);
      }
      if (!municipality?.percent || !municipality?.population) {
        return;
      }
      if (municipality.percent >= 100) {
        segments.qualified.push(municipality);
      }
      if (municipality.percent < 100 && municipality.population < 20000) {
        segments.smallMunicipalities.push(municipality);
      }
      if (municipality.percent < 100 && municipality.population > 20000) {
        segments.largeMunicipalities.push(municipality);
      }
    });
    segments.hot.sort((a, b) => {
      if (b.grewByPercent && a.grewByPercent) {
        return b.grewByPercent - a.grewByPercent;
      }
      return 0;
    });
    segments.qualified.sort((a, b) => {
      if (b.population && a.population) {
        return b.population - a.population;
      }
      return 0;
    });
    setLeaderboardSegments(segments);
  }, [municipalitiesGoalSignup]);

  useEffect(() => {
    if (allMunicipalityStats?.timePassed) {
      const calcStatsInDays =
        allMunicipalityStats.timePassed / 1000 / 60 / 60 / 24;
      setStatsInDays(calcStatsInDays);
    }
  }, [allMunicipalityStats]);

  return (
    <MunicipalityContext.Provider
      value={{
        isMunicipality,
        setIsMunicipality,
        municipality,
        setMunicipality,
        municipalityContentfulState,
        allMunicipalityStats,
        allMunicipalityStatsState,
        singleMunicipalityStats,
        singleMunicipalityStatsState,
        statsSummary,
        municipalitiesGoalSignup,
        leaderboardSegments,
        statsInDays,
        refreshContextStats: () => getAllMunicipalityStats(),
      }}
    >
      {children}
    </MunicipalityContext.Provider>
  );
};
