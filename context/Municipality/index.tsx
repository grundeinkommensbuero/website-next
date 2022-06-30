import React, {
  useState,
  useEffect,
  SetStateAction,
  ReactElement,
} from 'react';
import {
  useGetMunicipalityStats,
  MunicipalityStats,
} from '../../hooks/Api/Municipalities';

import municipalitiesJson from '../../data/municipalities.json';
import { hasKey } from '../../utils/hasKey';

type ChatGroup = {
  medium: string;
  link: string;
  name: string;
};

export type MunicipalityFromJson = {
  ags: string;
  name: string;
  slug: string;
  goal: number;
  population: number;
  nameUnique: string;
  zipCodes: string[];
};

export type Municipality = MunicipalityFromJson & {
  signups?: number;
  percent?: number;
  event?: { signups: [number, number] };
  grewByPercent?: number;
  groups?: ChatGroup[];
};

type MunicipalitsStatsSummary = {
  timestamp: string;
  users: number;
  municiplaities: number;
  previous: {
    timestamp: string;
    users: number;
    municiplaities: number;
  };
};

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
  allMunicipalityStats: MunicipalityStats;
  allMunicipalityStatsState: string;
  statsSummary: MunicipalitsStatsSummary | null;
  municipalities: Municipality[];
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
    nameUnique: '',
    population: 0,
    goal: 0,
    zipCodes: [],
  },
  setMunicipality: () => {},
  allMunicipalityStats: {
    municipalities: [],
  },
  allMunicipalityStatsState: '',
  statsSummary: {
    timestamp: '',
    users: 0,
    municiplaities: 0,
    previous: {
      users: 0,
      municiplaities: 0,
      timestamp: '',
    },
  },
  municipalities: [],
  leaderboardSegments: {},
  statsInDays: 0,
  refreshContextStats: () => {},
});

type MunicipalityProviderProps = {
  children: ReactElement | ReactElement[];
};

export const MunicipalityProvider = ({
  children,
}: MunicipalityProviderProps) => {
  const [isMunicipality, setIsMunicipality] = useState<boolean>(false);
  const [municipality, setMunicipalityState] = useState<Municipality | null>(
    null
  );
  const [statsSummary, setStatsSummary] =
    useState<MunicipalitsStatsSummary | null>(null);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  // Only needed for mapping
  const [municipalitiesInObject, setMunicipalitiesInObject] = useState<{
    [key: string]: Municipality;
  }>({});
  const [leaderboardSegments, setLeaderboardSegments] = useState({});
  const [statsInDays, setStatsInDays] = useState<number>(0);

  // Add the Signups and percentage to the municipality object
  const setMunicipality = (municipality: Municipality) => {
    let municipalityForContext = municipality;
    if (allMunicipalityStats?.municipalities && municipality?.ags) {
      const foundMunicipality = allMunicipalityStats.municipalities.find(
        ({ ags }) => ags === municipality.ags
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

  // Get general municipality stats (of all munics)
  useEffect(() => {
    getAllMunicipalityStats();
  }, []);

  useEffect(() => {
    if (allMunicipalityStats?.summary?.timestamp) {
      setStatsSummary(allMunicipalityStats.summary);
    }
  }, [allMunicipalityStats]);

  // The following is only needed for consolidation of data afterwards
  useEffect(() => {
    // Create Object with raw municipality data for faster reference
    const municipalityObject: { [key: string]: Municipality } =
      municipalitiesJson.reduce(
        (
          muniObj: {
            [key: string]: Municipality;
          },
          municipality: MunicipalityFromJson
        ) => {
          const objKey: string = municipality.ags.toString();
          if (hasKey(muniObj, objKey)) {
            muniObj[objKey] = { ...municipality };
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

  // Add signups to municipalities for leaderboard
  useEffect(() => {
    // Find all municipalities with signups and goal
    const municipalitiesWithSignups: Municipality[] = [];
    if ('municipalities' in allMunicipalityStats) {
      allMunicipalityStats.municipalities.forEach(municipality => {
        if (
          municipality.ags.toString() in municipalitiesInObject &&
          'goal' in municipalitiesInObject[municipality.ags.toString()] &&
          municipality?.signups
        ) {
          const fullMunicipality = {
            signups: municipality.signups,
            percent: Math.round(
              (municipality.signups /
                municipalitiesInObject[municipality.ags.toString()].goal!) *
                100
            ),
            ...municipalitiesInObject[municipality.ags.toString()],
          };
          municipalitiesWithSignups.push(fullMunicipality);
        }
      });

      municipalitiesWithSignups.sort((a, b) => {
        if (a.percent && b.percent) {
          return b.percent - a.percent;
        }
        return 0;
      });

      setMunicipalities(municipalitiesWithSignups);
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
    municipalities.forEach(municipality => {
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
  }, [municipalities]);

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
        allMunicipalityStats,
        allMunicipalityStatsState,
        statsSummary,
        municipalities,
        leaderboardSegments,
        statsInDays,
        refreshContextStats: () => getAllMunicipalityStats(),
      }}
    >
      {children}
    </MunicipalityContext.Provider>
  );
};
