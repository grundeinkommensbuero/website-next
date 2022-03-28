import React, { useState } from 'react';
import * as s from './style.module.less';
import * as gS from '../style.module.less';
import ImageUpload from '../../Forms/ImageUpload';
import { Button, InlineButton } from '../../Forms/Button';

export const SetupProfile = ({
  userData,
  userId,
  compIndex,
  setCurrentElementByIndex,
}) => {
  const [buttonIsDisabled, setButtonIsDisabled] = useState(
    !userData?.profilePictures
  );

  return (
    <>
      <section className={gS.pageContainer}>
        <h3 className={gS.moduleTitle}>Zeig Gesicht fürs Grundeinkommen</h3>
        <p className={gS.descriptionTextLarge}>
          Lade dein Profilfoto hoch, und zeige der Welt, dass du Grundeinkommen{' '}
          ausprobieren willst.
        </p>

        <div className={s.imageUploadContainer}>
          <ImageUpload
            userData={userData}
            userId={userId}
            showUploadLabel={false}
            showEditLabel={true}
            size={'large'}
            onUploadDone={() => setButtonIsDisabled(false)}
            onImageChosen={() => setButtonIsDisabled(true)}
          />
        </div>

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
      </section>
    </>
  );
};
