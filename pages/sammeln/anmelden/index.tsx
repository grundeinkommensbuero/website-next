import React, { useEffect, useState } from 'react';
import SignUp from '../../../components/Forms/SignUp';
import querystring from 'query-string';
import { SectionWrapper } from '../../../components/Section/SectionWrapper';
import { formatDate } from '../../../utils/formatDate';
import { useRouter } from 'next/router';
import s from './style.module.scss';
import { stateToAgs } from '../../../utils/stateToAgs';

const CollectorSignUpPage = () => {
  // Date and location of collection event, can be passed through query params
  const [date, setDate] = useState<string>();
  const [location, setLocation] = useState<string>();

  const router = useRouter();

  useEffect(() => {
    const { date, location } = querystring.parse(window.location.search);

    if (
      date &&
      location &&
      typeof date === 'string' &&
      typeof location === 'string'
    ) {
      setDate(date);
      setLocation(location);
    }
  }, []);

  return (
    <SectionWrapper colorScheme="colorSchemeWhite">
      <div className={s.container}>
        <div className={s.content}>
          <h3>Sei dabei!</h3>
          {date && location ? (
            <p>
              Du willst an der Sammlung oder dem Event am{' '}
              {formatDate(new Date(date))} in/am {location} teilnehmen?
            </p>
          ) : (
            <p>Du willst uns bei der Sammlung unterstützen?</p>
          )}

          <SignUp
            fieldsToRender={[
              'email',
              'username',
              'phoneNumber',
              'zipCode',
              'question',
            ]}
            overwriteMandatoryFields={['username']}
            fieldsToHideIfValueExists={['phoneNumber', 'zipCode']}
            // If this is a signup for a specific collection (date and location set), that should be saved.
            // Otherwise we pass that user wants to collect in general
            additionalData={{
              wantsToCollect:
                date && location
                  ? { meetup: { date, location } }
                  : { inGeneral: true },
              newsletterConsent: true,
              extraInfo: true,
              // TODO: handle different states
              ags: stateToAgs.berlin,
            }}
            postSignupAction={() => router.push('/sammeln/bild-hochladen')}
            showHeading={false}
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CollectorSignUpPage;
