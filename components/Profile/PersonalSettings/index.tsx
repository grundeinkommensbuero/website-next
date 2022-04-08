import React, { useState, useEffect } from 'react';
import { TextInput } from '../../Forms/TextInput';
import s from './style.module.scss';
import gS from '../style.module.scss';
import cN from 'classnames';
import {
  Button,
  InlineButton,
  PrimarySecondaryButtonContainer,
} from '../../Forms/Button';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import ImageUpload from '../../Forms/ImageUpload';
import { useUpdateUser } from '../../../hooks/Api/Users/Update';
import { ChangeEmail } from './ChangeEmail';
import { EditProfileSection } from '../EditProfileSection';
import { User } from '../../../context/Authentication';
import { formatDate } from '../../../utils/formatDate';
import Link from 'next/link';
import { BackToProfile } from '../BackToProfile';

type PersonalSettingsProps = {
  userData: User;
  userId: string;
  updateCustomUserData: () => void;
};

export const PersonalSettings = ({
  userData,
  userId,
  updateCustomUserData,
}: PersonalSettingsProps) => {
  const [updateUserState, updateUser] = useUpdateUser();

  const [waitingForApi, setWaitingForApi] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [tempName, setTempName] = useState<string>('');
  const [tempZIP, setTempZIP] = useState<string>('');
  const [tempCity, setTempCity] = useState<string>('');

  useEffect(() => {
    if (updateUserState === 'loading') {
      setWaitingForApi(true);
    }
    if (updateUserState === 'updated') {
      setTimeout(() => {
        setWaitingForApi(false);
        updateCustomUserData();
      }, 750);
    }
    if (updateUserState === 'error') {
      setWaitingForApi(false);
    }
    // eslint-disable-next-line
  }, [updateUserState]);

  // eslint-disable-next-line
  useEffect(() => {
    if (userData) {
      if (tempName === '') {
        setTempName(userData.username);
      }

      if (tempZIP === '' && userData.zipCode) {
        setTempZIP(userData.zipCode);
      }

      if (tempCity === '') {
        setTempCity(userData.city);
      }
    }
  });

  const saveUserDataChanges = () => {
    if (tempName !== userData.username) {
      updateUser({ userId: userId, username: tempName });
    }
    if (tempZIP !== userData.zipCode) {
      updateUser({ userId: userId, zipCode: tempZIP });
    }
    if (tempCity !== userData.city) {
      updateUser({ userId: userId, city: tempCity });
    }
  };

  return (
    <section className={gS.profilePageGrid}>
      <EditProfileSection>
        <BackToProfile />

        <section className={s.userInfo}>
          <div className={gS.avatarContainer}>
            <ImageUpload
              className={gS.avatar}
              userData={userData}
              userId={userId}
              buttonOnAquaBackground={true}
              size={'large'}
              onUploadDone={() => {}}
              smallSubmitButton={true}
            />
          </div>
          <div className={s.marginBottomOnMobile}>
            <h2
              className={cN({
                [gS.username]: userData.username,
              })}
            >
              {userData.username || userData.email}
            </h2>
            <div className={gS.placeInfo}>{userData.city}</div>
            <div>
              Dabei seit dem{' '}
              {userData.createdAt && formatDate(new Date(userData.createdAt))}
            </div>
          </div>
        </section>

        <section className={s.dataEditWrapper}>
          <div className={s.dataEditSection}>
            <h4 className={gS.optionSectionHeading}>Deine Stammdaten</h4>
            <p className={s.optionSectionDescription}>
              Name oder Adresse ändern:
            </p>
            <p className={s.optionHeading}>Name</p>
            <div className={s.editTextInput}>
              <TextInput
                onChange={setTempName}
                placeholder="Name"
                value={tempName || ''}
                className={cN({
                  [s.inputHighlighted]: tempName !== userData.username,
                })}
              />
            </div>
            <p className={s.optionHeading}>Postleitzahl</p>
            <div className={s.editTextInput}>
              <TextInput
                onChange={setTempZIP}
                placeholder="Postleitzahl"
                value={tempZIP || ''}
                className={cN({
                  [s.inputHighlighted]: tempZIP !== userData.zipCode,
                })}
              />
            </div>
            <p className={s.optionHeading}>Ort</p>
            <div className={s.editTextInput}>
              <TextInput
                onChange={setTempCity}
                placeholder="Ort"
                value={tempCity || ''}
                className={cN({
                  [s.inputHighlighted]: tempCity !== userData.city,
                })}
              />
            </div>

            {!waitingForApi &&
            (tempName !== userData.username ||
              tempZIP !== userData.zipCode ||
              tempCity !== userData.city) ? (
              <PrimarySecondaryButtonContainer>
                <InlineButton
                  onClick={() => {
                    setTempName(userData.username);
                    setTempZIP(userData.zipCode || '');
                    setTempCity(userData.city);
                  }}
                >
                  Abbrechen
                </InlineButton>
                <Button onClick={saveUserDataChanges}>Speichern</Button>
              </PrimarySecondaryButtonContainer>
            ) : (
              <section>
                {waitingForApi && (
                  <span>
                    <span className={gS.loading}></span>
                    <b className={gS.loadingMsg}>Speichern</b>
                  </span>
                )}
              </section>
            )}

            <ChangeEmail
              updateCustomUserData={updateCustomUserData}
              userData={userData}
            />

            {!showDeleteAccountDialog ? (
              <button
                className={cN(gS.linkLikeFormattedButton, gS.bottomRightLink)}
                onClick={() => setShowDeleteAccountDialog(true)}
              >
                Profil löschen
              </button>
            ) : (
              <div>
                <br></br>
                <DeleteAccountDialog
                  userId={userId}
                  setShowDeleteAccountDialog={setShowDeleteAccountDialog}
                />
              </div>
            )}
          </div>
        </section>
      </EditProfileSection>
    </section>
  );
};
