import React from 'react';
import { MapConfig } from './';
import dynamic from 'next/dynamic';

const LoadableMap = dynamic(() => import('./LazyMap'), { ssr: true });

export type LocationType = 'collect' | 'lists' | 'storage';

export type Location = {
  coordinates: {
    lon: number;
    lat: number;
  };
  type: LocationType;
  locationName?: string;
  address?: string | null;
  title: string;
  description?: string;
  typeOfStorage?: string;
  contact?: string;
  startTime?: string;
  endTime?: string;
  phone?: string;
  date?: string;
  mail?: string;
  city?: string;
  zipCode?: string;
};

export type MapProps = {
  mapConfig: MapConfig;
  locations?: Location[];
  withSearch?: boolean;
  onLocationChosen?: (e: any) => void;
  className?: string;
};

const Map = ({
  mapConfig,
  locations,
  withSearch,
  onLocationChosen,
  className,
}: MapProps) => {
  return (
    <LoadableMap
      mapConfig={mapConfig}
      locations={locations}
      withSearch={withSearch}
      onLocationChosen={onLocationChosen}
      className={className}
    />
  );
};

export default Map;
