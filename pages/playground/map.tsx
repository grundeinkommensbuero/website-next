import React from 'react';
import CollectionMap from '../../components/CollectionMap';
import { SectionWrapper } from '../../components/Section/SectionWrapper';

const MapPlaygroundPage = () => {
  return (
    <SectionWrapper colorScheme="colorSchemeRoseOnWhite">
      <CollectionMap
        mapConfig={{
          state: 'berlin',
          maxBounds: [
            [13.05, 52.2],
            [13.8, 52.8],
          ],
        }}
      />
    </SectionWrapper>
  );
};

export default MapPlaygroundPage;
