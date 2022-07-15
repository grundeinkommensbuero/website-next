import React from 'react';
import { ShowMeetups } from './ShowMeetups';
import s from './style.module.scss';
import cN from 'classnames';

export type Coordinates = [number, number];

export type MapConfig = {
  state: string;
  maxBounds: [Coordinates, Coordinates];
};

const CollectionMap = ({ maps }: { maps: MapConfig[] }) => {
  return (
    <>
      {maps.map((mapConfig, i) => {
        return (
          <ShowMeetups
            key={i}
            mapConfig={mapConfig}
            // Needed for overflowing popup if there is two maps (e.g. in Bremen)
            className={cN({
              [s.mapSection]: maps.length > 1 && i === 0,
            })}
          />
        );
      })}
    </>
  );
};

export default CollectionMap;
