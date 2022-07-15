import { useRouter } from 'next/router';
import React from 'react';
import CollectionMap from '../../components/CollectionMap';
import { SectionWrapper } from '../../components/Section/SectionWrapper';

import { SignatureListJourney } from '../../components/SignatureListJourney';
import s from './style.module.scss';

const MapPlaygroundPage = () => {
  return (
    <SectionWrapper colorScheme="colorSchemeRoseOnWhite">
      <CollectionMap
        maps={[
          {
            state: 'berlin',
            maxBounds: [
              [13.05, 52.2],
              [13.8, 52.8],
            ],
          },
        ]}
      />
    </SectionWrapper>
  );
};

export default MapPlaygroundPage;
