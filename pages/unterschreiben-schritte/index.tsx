import { useRouter } from 'next/router';
import React from 'react';
import { SectionWrapper } from '../../components/Section/SectionWrapper';

import { SignatureListJourney } from '../../components/SignatureListJourney';
import s from './style.module.scss';

const JourneyPage = () => {
  const router = useRouter();

  const pdfUrl =
    typeof router.query?.pdfUrl == 'string' ? router.query.pdfUrl : undefined;

  return (
    <SectionWrapper colorScheme="colorSchemeViolet">
      <SignatureListJourney pdfUrl={pdfUrl} />
    </SectionWrapper>
  );
};

export default JourneyPage;
