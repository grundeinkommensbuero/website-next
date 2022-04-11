import React, { useState, useEffect } from 'react';
import s from './style.module.scss';
import gS from '../style.module.scss';
import cN from 'classnames';
import { NewsletterCard } from './NewsletterCard';
import { SearchPlaces } from '../../Forms/SearchPlaces';
import { Button } from '../../Forms/Button';
import { EditProfileSection } from '../EditProfileSection';

import { useUpdateUser } from '../../../hooks/Api/Users/Update';
import {
  CustomNewsletterConsent,
  NewsletterConsent,
  User,
} from '../../../context/Authentication';
import { Municipality } from '../../../context/Municipality';
import { BackToProfile } from '../BackToProfile';

type ProfileNotificationsProps = {
  userId: string;
  userData: User;
  updateCustomUserData: () => void;
};

export const ProfileNotifications = ({
  userData,
  userId,
  updateCustomUserData,
}: ProfileNotificationsProps) => {
  const [componentToBeUpdated, setComponentToBeUpdated] = useState<string>('');
  const [updateUserState, updateUser] = useUpdateUser();
  const [waitingForApi, setWaitingForApi] = useState(false);
  const [mainNewsletterConsent, setMainNewsletterConsent] = useState<
    Omit<NewsletterConsent, 'timestamp'>
  >({ value: false });
  const [reminderMailConsent, setReminderMailConsent] = useState<
    Omit<NewsletterConsent, 'timestamp'>
  >({ value: false });
  const [customNewsletterSettings, setCustomNewsletterSettings] = useState<
    CustomNewsletterConsent[]
  >([]);
  const [municipality, setMunicipality] = useState<Municipality>();
  const [
    unsubscribeMainNewsletterDialogActive,
    setUnsubscribeMainNewsletterDialog,
  ] = useState(false);
  const [
    unsubscribeReminderMailsDialogActive,
    setUnsubscribeReminderMailsDialog,
  ] = useState(false);
  const [unsubscribeAllDialogActive, setShowUnsubscribeAllDialog] =
    useState<boolean>(false);

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

  // setup newsletter state depending on userData
  useEffect(() => {
    if (userData && userData.newsletterConsent) {
      setMainNewsletterConsent(userData.newsletterConsent);
    }
    if (userData && userData.reminderMails) {
      setReminderMailConsent(userData.reminderMails);
    }
    if (userData && userData.customNewsletters) {
      setCustomNewsletterSettings(userData.customNewsletters);
    }
  }, [userData]);

  // store user selected location to add custom newsletters
  const handlePlaceSelect = (suggestion: Municipality) => {
    setMunicipality(suggestion);
  };

  // show unsubscribe dialog, set target to show loading animation
  const toggleUnsubscribeMainNewsletterDialog = () => {
    setComponentToBeUpdated('Main');
    setUnsubscribeMainNewsletterDialog(!unsubscribeMainNewsletterDialogActive);
  };

  // unsubscribe from Main newsletter
  const toggleMainNewsletterConsent = async () => {
    try {
      setComponentToBeUpdated('Main');

      let updatedMainNewsletterConsent = !mainNewsletterConsent.value;

      updateUser({
        userId: userId,
        newsletterConsent: updatedMainNewsletterConsent,
      });
      setMainNewsletterConsent({ value: updatedMainNewsletterConsent });
      setUnsubscribeMainNewsletterDialog(false);
    } catch (e) {
      console.log(e);
    }
  };

  // unsubscribe from Reminder Mails
  const toggleReminderMailConsent = async () => {
    try {
      setComponentToBeUpdated('MailSettings');

      let updatedReminderMailConsent = !reminderMailConsent.value;

      updateUser({
        userId: userId,
        reminderMails: updatedReminderMailConsent,
      });
      setReminderMailConsent({ value: updatedReminderMailConsent });
      setUnsubscribeReminderMailsDialog(false);
    } catch (e) {
      console.log(e);
    }
  };

  // show unsubscribe dialog, set target to show loading animation
  const toggleUnsubscribeReminderMailsDialog = () => {
    setComponentToBeUpdated('MailSettings');
    setUnsubscribeReminderMailsDialog(!unsubscribeReminderMailsDialogActive);
  };

  // decide how to proceed with a user created custom newsletter
  const handleNewsletterAddRequest = () => {
    if (!municipality) return;
    const newsletterToAdd = constructNewsletter(municipality);
    let newsletterExists = false;
    for (let i = 0; i < customNewsletterSettings.length; i++) {
      if (customNewsletterSettings[i].ags === newsletterToAdd.ags) {
        newsletterExists = true;
        if (customNewsletterSettings[i].value) {
          /* Notify user, that newsletter already exists? */
        } else {
          reactivateNewsletter(newsletterToAdd);
        }
      }
    }
    /* If newsletter does not exist, create a new entry */
    if (!newsletterExists) {
      addNewsletter(newsletterToAdd);
    }
  };

  const constructNewsletter = (municipality: Municipality) => {
    const newNewsletter = {
      name: municipality.name,
      value: true,
      extraInfo: true,
      timestamp: new Date().toISOString(),
      ags: municipality.ags,
    };
    return newNewsletter;
  };

  const reactivateNewsletter = async (newsletter: CustomNewsletterConsent) => {
    try {
      setComponentToBeUpdated(newsletter.ags);
      const updatedNewsletters = [...customNewsletterSettings];
      for (let i = 0; i < updatedNewsletters.length; i++) {
        if (updatedNewsletters[i].ags === newsletter.ags) {
          newsletter.value = true;
          newsletter.timestamp = new Date().toISOString();
          newsletter.extraInfo = true;
          updatedNewsletters[i] = newsletter;
        }
      }
      await updateUser({
        userId: userId,
        customNewsletters: updatedNewsletters,
      });
      setCustomNewsletterSettings(updatedNewsletters);
    } catch (e) {
      console.log(e);
    }
  };

  const addNewsletter = async (newsletter: CustomNewsletterConsent) => {
    try {
      setComponentToBeUpdated(newsletter.ags);
      const updatedNewsletters = [...customNewsletterSettings];
      updatedNewsletters.push(newsletter);
      updateUser({ userId: userId, customNewsletters: updatedNewsletters });
      setCustomNewsletterSettings(updatedNewsletters);
    } catch (e) {
      console.log(e);
    }
  };

  // callback for child-component to save individual newsletter settings
  const updateSingleNewsletter = async (
    newsletter: CustomNewsletterConsent
  ) => {
    setComponentToBeUpdated(newsletter.ags);
    try {
      const updatedNewsletters = [...customNewsletterSettings];
      for (let i = 0; i < updatedNewsletters.length; i++) {
        if (updatedNewsletters[i].ags === newsletter.ags) {
          updatedNewsletters[i] = newsletter;
        }
      }
      updateUser({ userId: userId, customNewsletters: updatedNewsletters });
      setCustomNewsletterSettings(updatedNewsletters);
    } catch (e) {
      console.log(e);
    }
  };

  const unsubscribeAllNewsletters = () => {
    const updatedNewsletters = [...customNewsletterSettings];
    for (let i = 0; i < updatedNewsletters.length; i++) {
      updatedNewsletters[i].value = false;
    }
    updateUser({
      userId: userId,
      newsletterConsent: false,
      customNewsletters: updatedNewsletters,
    });
    setCustomNewsletterSettings(updatedNewsletters);
    setMainNewsletterConsent({ value: false });
    setShowUnsubscribeAllDialog(false);
  };

  const MainCard = () => {
    return (
      <div className={cN(s.newsletterCard, 'colorSchemeWhite')}>
        <p className={s.newsletterCardHeading}>
          Allgemeiner Expeditions-Letter
        </p>
        {/* main newsletter info claim */}
        {mainNewsletterConsent && mainNewsletterConsent.value ? (
          <p className={s.newsletterCardDescription}>
            Du erhältst die wichtigsten Infos über die Expedition.
          </p>
        ) : (
          <p className={s.newsletterCardDescription}>
            Du erhältst keine Infos über die Expedition.
          </p>
        )}
        {/* toggle main newsletter consent */}
        {waitingForApi && componentToBeUpdated === 'Main' ? (
          <p className={cN(gS.alignRight, gS.noMargin)}>
            <span className={gS.loading}></span>
            <b className={gS.loadingMsg}>Speichern</b>
          </p>
        ) : (
          <p className={cN(gS.alignRight, gS.noMargin)}>
            {mainNewsletterConsent && mainNewsletterConsent.value ? (
              <button
                className={cN(gS.linkLikeFormattedButton, gS.onWhiteBackground)}
                onClick={toggleUnsubscribeMainNewsletterDialog}
              >
                abbestellen
              </button>
            ) : (
              <button
                className={cN(gS.linkLikeFormattedButton, gS.onWhiteBackground)}
                onClick={toggleMainNewsletterConsent}
              >
                Newsletter erhalten
              </button>
            )}
          </p>
        )}
      </div>
    );
  };

  const MailSettingCard = () => {
    return (
      <div className={cN(s.newsletterCard, 'colorSchemeWhite')}>
        <p className={s.newsletterCardHeading}>Erinnerungsmails</p>
        {/* remindermail info claim */}
        {reminderMailConsent && reminderMailConsent.value ? (
          <p className={s.newsletterCardDescription}>
            Du erhältst verschiedene Erinnerungsmails von uns.
          </p>
        ) : (
          <p className={s.newsletterCardDescription}>
            Du erhältst keine Erinnerungsmails von uns.
          </p>
        )}
        {/* toggle remindermail consent */}
        {waitingForApi && componentToBeUpdated === 'MailSettings' ? (
          <p className={cN(gS.alignRight, gS.noMargin)}>
            <span className={gS.loading}></span>
            <b className={gS.loadingMsg}>Speichern</b>
          </p>
        ) : (
          <p className={cN(gS.alignRight, gS.noMargin)}>
            {reminderMailConsent && reminderMailConsent.value ? (
              <button
                className={cN(gS.linkLikeFormattedButton, gS.onWhiteBackground)}
                onClick={toggleUnsubscribeReminderMailsDialog}
              >
                abbestellen
              </button>
            ) : (
              <button
                className={cN(gS.linkLikeFormattedButton, gS.onWhiteBackground)}
                onClick={toggleReminderMailConsent}
              >
                Erinnerungsmails erhalten
              </button>
            )}
          </p>
        )}
      </div>
    );
  };

  const UnsubscribeNewsletterDialog = () => {
    return (
      <section className={cN(s.newsletterCard, 'colorSchemeWhite')}>
        <p className={s.newsletterCardHeading}>
          Bist du sicher, dass du den Expeditions-Letter nicht mehr bekommen
          möchtest?
        </p>
        <br />
        <p className={s.newsletterCardDescription}>
          Wir können dich nicht mehr informieren.
        </p>
        <div className={s.revokeButtonRow}>
          <Button
            className={s.revokeButton}
            onClick={toggleMainNewsletterConsent}
          >
            Abbestellen
          </Button>
          <div className={s.cancelRevokeProcess}>
            <button
              className={cN(gS.linkLikeFormattedButton, gS.onWhiteBackground)}
              onClick={toggleUnsubscribeMainNewsletterDialog}
            >
              Newsletter weiter erhalten
            </button>
          </div>
        </div>
      </section>
    );
  };

  const UnsubscribeReminderMailsDialog = () => {
    return (
      <section className={cN(s.newsletterCard, 'colorSchemeWhite')}>
        <p className={s.newsletterCardHeading}>
          Bist du sicher, dass du keine Erinnerungsmails mehr bekommen möchtest?
        </p>
        <br />
        <p className={s.newsletterCardDescription}>
          Wir können dich dann nur noch eingeschränkt informieren.
        </p>
        <div className={s.revokeButtonRow}>
          <Button
            className={s.revokeButton}
            onClick={toggleReminderMailConsent}
          >
            Abbestellen
          </Button>
          <div className={s.cancelRevokeProcess}>
            <button
              className={cN(gS.linkLikeFormattedButton, gS.onWhiteBackground)}
              onClick={toggleUnsubscribeReminderMailsDialog}
            >
              Erinnerungsmails weiter erhalten
            </button>
          </div>
        </div>
      </section>
    );
  };

  const UnsubscribeAllDialog = () => {
    return (
      <section className={cN(s.newsletterCard, 'colorSchemeWhite')}>
        <p className={s.newsletterCardHeading}>
          Bist du sicher, dass du keine Newsletter von uns mehr bekommen
          möchtest?
        </p>
        <br />
        <p className={s.newsletterCardDescription}>
          Wir können dich nicht mehr informieren.
        </p>
        <div className={s.revokeButtonRow}>
          <Button
            className={s.revokeButton}
            onClick={unsubscribeAllNewsletters}
          >
            Abbestellen
          </Button>
          <div className={s.cancelRevokeProcess}>
            <button
              className={cN(gS.linkLikeFormattedButton, gS.onWhiteBackground)}
              onClick={() => setShowUnsubscribeAllDialog(false)}
            >
              Newsletter weiter erhalten
            </button>
          </div>
        </div>
      </section>
    );
  };

  // return active newsletter components
  const activeNewsletterCards = customNewsletterSettings.map(newsletter => {
    return (
      newsletter.value && (
        <NewsletterCard
          newsletter={newsletter}
          key={`${newsletter.name}${newsletter.ags}`}
          updateSingleNewsletter={updateSingleNewsletter}
          waitingForApi={waitingForApi}
          componentToBeUpdated={componentToBeUpdated}
        />
      )
    );
  });

  return (
    <section className={gS.profilePageGrid}>
      <EditProfileSection>
        <BackToProfile />

        <h2>Newsletter & Kontakt</h2>
        <h3 className={gS.optionSectionHeading}>E-Mail Einstellungen</h3>

        {userData?.newsletterConsent && (
          <section>
            {/* Main Card is always visible */}
            {!unsubscribeReminderMailsDialogActive ? (
              <MailSettingCard />
            ) : (
              <UnsubscribeReminderMailsDialog />
            )}
          </section>
        )}

        <h3 className={gS.optionSectionHeading}>
          Deine abonnierten Newsletter
        </h3>

        {userData?.newsletterConsent && (
          <section>
            {/* Main Card is always visible */}
            {!unsubscribeMainNewsletterDialogActive ? (
              <MainCard />
            ) : (
              <UnsubscribeNewsletterDialog />
            )}
            {/* Conditionally render custom newsletter Cards */}
            <div>{activeNewsletterCards}</div>
          </section>
        )}

        <h3 className={gS.optionSectionHeading}>
          Regionale Newsletter hinzufügen
        </h3>
        <div className={s.searchPlaces}>
          <SearchPlaces
            label={''}
            showButton={municipality !== undefined && !waitingForApi}
            profileButtonStyle={true}
            onPlaceSelect={handlePlaceSelect}
            buttonLabel={`${municipality ? municipality.name : ''} hinzufügen`}
            handleButtonClick={() => handleNewsletterAddRequest()}
          />
        </div>

        {!unsubscribeAllDialogActive ? (
          <button
            className={cN(gS.linkLikeFormattedButton, gS.bottomRightLink)}
            onClick={() => setShowUnsubscribeAllDialog(true)}
          >
            Alle abbestellen
          </button>
        ) : (
          <UnsubscribeAllDialog />
        )}
      </EditProfileSection>
    </section>
  );
};
