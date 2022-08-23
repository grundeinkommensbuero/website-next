import React, { useEffect, useState, useContext } from 'react';
import querystring from 'query-string';
import AuthContext from '../context/Authentication';
import { useCreateSignatureList } from '../hooks/Api/Signatures/Create';
import { useRouter } from 'next/router';
import { FinallyMessage } from '../components/Forms/FinallyMessage';
import { EnterLoginCode } from '../components/Login/EnterLoginCode';
import { InlineButton } from '../components/Forms/Button';
import { SectionWrapper } from '../components/Section/SectionWrapper';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

const Unterschriftenliste = () => {
  const [state, pdf, anonymous, createPdf] = useCreateSignatureList();
  // Default should be berlin-2, if people forget it in a newsletter or wherever
  const [campaignCode, setCampaignCode] = useState('berlin-2');
  const { userId, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const urlParams = querystring.parse(window.location.search);

    if (typeof urlParams.campaignCode === 'string') {
      setCampaignCode(urlParams.campaignCode);
    }
  }, []);

  // As soon as signature list is created we navigate to to "checkpoints" page
  // But only if download was not anonymous

  useEffect(() => {
    if (state === 'created' && pdf.url && !anonymous) {
      router.push({
        pathname: '/unterschreiben-schritte',
        query: { pdfUrl: pdf.url },
      });
    }
  }, [state, pdf]);

  useEffect(() => {
    if (campaignCode && userId) {
      if (isAuthenticated) {
        createPdf({
          campaignCode,
          userExists: true,
          shouldNotUpdateUser: true,
        });
      }
    }
  }, [isAuthenticated, userId, campaignCode]);

  return (
    <SectionWrapper
      colorScheme={`${
        IS_BERLIN_PROJECT ? 'colorSchemeRoseOnWhite' : 'colorSchemeWhite'
      }`}
    >
      <>
        <p>Schön, dass du mit uns sammelst. So geht’s weiter:</p>
        {state === 'creating' && (
          <FinallyMessage loading>
            Liste wird generiert, bitte einen Moment Geduld...
          </FinallyMessage>
        )}
        {state === 'error' && (
          <FinallyMessage>Da ist was schief gegangen</FinallyMessage>
        )}
        {isAuthenticated === false && !state && (
          <EnterLoginCode
            wrongCodeMessage={
              <>
                <p>
                  Der eingegebene Code ist falsch oder bereits abgelaufen. Bitte
                  überprüfe die Email erneut oder fordere unten einen neuen Code
                  an.
                </p>
                <p>
                  Du kannst auch eine Liste{' '}
                  <InlineButton
                    onClick={() => {
                      createPdf({ campaignCode, anonymous: true });
                    }}
                    type="button"
                  >
                    hier
                  </InlineButton>{' '}
                  anonym herunterladen.
                </p>
              </>
            }
          >
            <p>
              Hey, wir kennen dich schon! Bitte gib den Code ein, den wir dir
              gerade in einer E-Mail geschickt haben. Alternativ kannst du auch
              eine Liste{' '}
              <InlineButton
                onClick={() => {
                  createPdf({ campaignCode, anonymous: true });
                }}
                type="button"
              >
                hier
              </InlineButton>{' '}
              anonym herunterladen.
            </p>
          </EnterLoginCode>
        )}

        {state === 'created' && anonymous && (
          <FinallyMessage>
            <p>
              Juhu!{' '}
              <a target="_blank" rel="noreferrer" href={pdf.url}>
                Hier
              </a>{' '}
              kannst du die Unterschriftslisten herunterladen!
            </p>
          </FinallyMessage>
        )}
      </>
    </SectionWrapper>
  );
};

export default Unterschriftenliste;
