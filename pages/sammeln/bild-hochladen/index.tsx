import React, { useContext, useEffect, useState } from 'react';
import { FinallyMessage } from '../../../components/Forms/FinallyMessage';
import ImageUpload from '../../../components/Forms/ImageUpload';
import AuthContext from '../../../context/Authentication';
import { Button, InlineButton } from '../../../components/Forms/Button';
import s from './style.module.scss';
import { SectionWrapper } from '../../../components/Section/SectionWrapper';
import { useRouter } from 'next/router';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

const CollectorImageUploadPage = () => {
  const { customUserData, userId, isAuthenticated } = useContext(AuthContext);

  const [buttonIsDisabled, setButtonIsDisabled] = useState(
    !customUserData?.profilePictures
  );

  const router = useRouter();

  useEffect(() => {
    if (customUserData?.profilePictures) {
      setButtonIsDisabled(false);
    }
  }, [customUserData]);

  // If not authenticated we want to navigate to anmeldung page
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/sammeln/anmelden');
    }
  }, [isAuthenticated]);

  return (
    <SectionWrapper
      colorScheme={
        IS_BERLIN_PROJECT ? 'colorSchemeRoseOnWhite' : 'colorSchemeWhite'
      }
    >
      <div className={s.container}>
        <div className={s.content}>
          <FinallyMessage>
            Willkommen bei der Expedition! Wenn du möchtest, lad doch ein Foto
            hoch.
          </FinallyMessage>

          <h3 className={'my-4'}>Zeig Gesicht fürs Grundeinkommen</h3>
          <p>
            Lade dein Profilfoto hoch, und zeige der Welt, dass du
            Grundeinkommen ausprobieren willst.
          </p>

          <ImageUpload
            userData={customUserData}
            userId={userId}
            size={'large'}
            onUploadDone={() => setButtonIsDisabled(false)}
            onImageChosen={() => setButtonIsDisabled(true)}
          />

          <div className={s.buttonContainer}>
            <div>
              <Button
                onClick={() => router.push('/sammeln/aktiv-werden')}
                disabled={buttonIsDisabled}
                className={s.button}
              >
                Weiter
              </Button>
            </div>
            <div>
              <InlineButton
                aria-label={'Schritt überspringen'}
                onClick={() => router.push('/sammeln/aktiv-werden')}
                className={s.button}
              >
                Jetzt nicht
              </InlineButton>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CollectorImageUploadPage;
