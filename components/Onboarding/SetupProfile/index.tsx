import React, { useState } from 'react';
import s from './style.module.scss';
import gS from '../style.module.scss';
// import ImageUpload from '../../Forms/ImageUpload';
import { Button, InlineButton } from '../../Forms/Button';
import { User } from '../../../context/Authentication';
import { PageContainer } from '../PageContainer';

type SetupProfileProps = {
  userData: User;
  userId: string;
  compIndex: number;
  setCurrentElementByIndex: (index: number) => void;
};

export const SetupProfile = ({
  userData,
  userId,
  compIndex,
  setCurrentElementByIndex,
}: SetupProfileProps) => {
  const [buttonIsDisabled, setButtonIsDisabled] = useState(
    !userData?.profilePictures
  );

  return (
    <PageContainer>
      <h3 className={gS.moduleTitle}>Zeig Gesicht fürs Grundeinkommen</h3>
      <p className={gS.descriptionTextLarge}>
        Lade dein Profilfoto hoch, und zeige der Welt, dass du Grundeinkommen{' '}
        ausprobieren willst.
      </p>

      {/* <div className={s.imageUploadContainer}>
        <ImageUpload
          userData={userData}
          userId={userId}
          showUploadLabel={false}
          showEditLabel={true}
          size={'large'}
          onUploadDone={() => setButtonIsDisabled(false)}
          onImageChosen={() => setButtonIsDisabled(true)}
        />
      </div> */}

      <div className={gS.fullWidthFlex}>
        <Button
          className={gS.nextButton}
          onClick={() => setCurrentElementByIndex(compIndex + 1)}
          disabled={buttonIsDisabled}
        >
          Weiter
        </Button>
      </div>
      <div className={gS.fullWidthFlex}>
        <InlineButton
          aria-label={'Schritt überspringen'}
          onClick={() => setCurrentElementByIndex(compIndex + 1)}
        >
          Jetzt nicht
        </InlineButton>
      </div>
    </PageContainer>
  );
};
