/**
 * This hook is used to map a given point (lat, long) to a district of Berlin
 */

import { SetStateAction, useState } from 'react';
import pointInPolygon from 'point-in-polygon';
import json from './data/districts.json';

export const useMapDistricts = (): [
  string | undefined,
  (coordinates: number[]) => void
] => {
  const [district, setDistrict] = useState<string>();

  return [
    district,
    coordinates => mapLocationToDistrict(coordinates, setDistrict),
  ];
};

const mapLocationToDistrict = async (
  coordinates: number[],
  setDistrict: React.Dispatch<SetStateAction<string | undefined>>
) => {
  const districts = json.features;

  const foundDisctrict = districts.find(({ geometry }) =>
    pointInPolygon(coordinates, geometry.coordinates[0])
  );

  setDistrict(foundDisctrict?.properties.BEZIRKSREG);
};
