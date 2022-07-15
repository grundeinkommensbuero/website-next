import React from 'react';
import { ShowMeetups } from './ShowMeetups';
import s from './style.module.scss';
import cN from 'classnames';

export type Coordinates = [number, number];

export type MapConfig = {
  state: string;
  maxBounds: [Coordinates, Coordinates];
};

const CollectionMap = ({ mapConfig }: { mapConfig: MapConfig }) => {
  return <ShowMeetups mapConfig={mapConfig} />;
};

export default CollectionMap;
