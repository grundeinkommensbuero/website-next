import { useRouter } from 'next/router';
import React from 'react';
import { SectionWrapper } from '../../components/Section/SectionWrapper';

import { SignatureListJourney } from '../../components/SignatureListJourney';
import s from './style.module.scss';

const JourneyPage = () => {
  const router = useRouter();

  return (
    <SectionWrapper colorScheme="colorSchemeViolet">
      <SignatureListJourney pdfUrl={router.query?.pdfUrl} />
    </SectionWrapper>
  );
};

export default JourneyPage;
