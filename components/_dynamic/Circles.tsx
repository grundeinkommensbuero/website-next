// TS declaration file will follow soon
// @ts-ignore
import CirclesPink from '@circles-pink/web-client';
import { useContext, useEffect, useState } from 'react';
import AuthContext, { CirclesResumee } from '../../context/Authentication';
import { useUpdateUser } from '../../hooks/Api/Users/Update';
import { SmallSignup } from '../Forms/SmallSignup';
import { NoSsr } from '../Util/NoSsr';
import querystring from 'query-string';
import translations from '../../data/transaltions.json';
import CirclesSharingFeature from '../CirclesShare';

const xbgeTheme = {
  baseColor: '#FB8298',
  cardColor: '#f9ccd4',
  lightColor: '#FFEBEE',
  darkColor: '#65655E',
  textColorLight: '#fff',
  textColorDark: '#7e7e7e',
  bgColor: '#fff',
};

const Circles = () => {
  const { userId, isAuthenticated, customUserData, updateCustomUserData } =
    useContext(AuthContext);

  const [updateState, updateUserStore] = useUpdateUser();

  const resumee = customUserData?.store?.circlesResumee;
  const voucherShopEnabled = !customUserData.store?.voucherStoreEnabled
    ? false
    : true;
  const savedSafeAddress = !customUserData?.store?.circlesResumee?.safeAddress
    ? null
    : customUserData?.store?.circlesResumee?.safeAddress;

  const saveCirclesTracking = (circlesResumee: CirclesResumee) => {
    updateUserStore({
      userId: userId,
      store: {
        circlesResumee,
      },
    });
  };

  useEffect(() => {
    if (updateState === 'updated') {
      updateCustomUserData();
    }
  }, [updateState]);

  useEffect(() => {
    // Only update user, if custom user data was loaded
    // so existing referred safe addresses are not overwritten
    if (isAuthenticated && customUserData.email) {
      let usernames = customUserData.store?.referredByCirclesUsername || [];
      const { username } = querystring.parse(window.location.search);

      if (typeof username === 'string') {
        if (!usernames.includes(username)) {
          usernames.push(username);
          const uniqueUsernames = [...new Set(usernames)];

          updateUserStore({
            userId,
            store: {
              referredByCirclesUsername: uniqueUsernames,
            },
          });
        }
      }

      // If usernames were saved as duplicates du to a bug, clear them from store
      // when authenticated user visits the page, without clicking a share link again.
      // This can be removed in a week or so :)
      if (usernames.length > 0) {
        const uniqueUsernames = [...new Set(usernames)];
        // If length from set is not the same, save unique values to db
        if (uniqueUsernames.length !== usernames.length) {
          updateUserStore({
            userId,
            store: {
              referredByCirclesUsername: uniqueUsernames,
            },
          });
        }
      }
    }
  }, [isAuthenticated, customUserData]);

  return (
    <>
      {!isAuthenticated && (
        <>
          <p>
            Bitte gib deine E-Mail-Adresse an. Wenn du schon bei der Expedition
            angemeldet bist, nimm bitte deine Expeditions-Adresse.
          </p>
        </>
      )}
      <SmallSignup
        loginCodeInModal={false}
        showNewsletterConsent={true}
        hideIfAuthenticated={true}
        nudgeBoxText={
          'Ich möchte mich bei der Expedition Grundeinkommen anmelden'
        }
      />
      {isAuthenticated && (
        <NoSsr>
          <>
            {customUserData && (
              <>
                <p>
                  Hier kannst du dir eine Geldbörse in der
                  Grundeinkommens-Kryptowährung Circles anlegen und deine
                  Freund:innen freischalten. Sobald 3 Menschen deinen Account
                  bestätigt haben, bekommst du 720 Circles pro Monat ein Leben
                  lang. Das enspricht heute einem Wert von 72 €.
                </p>
                <p>
                  Hallo
                  {customUserData.username ? ` ${customUserData.username}` : ''}
                  ! Du bist mit der E-Mail-Adresse {customUserData.email} bei
                  uns eingeloggt.{' '}
                </p>
                <p>
                  Wenn du Hilfe brauchst, komm in unsere{' '}
                  <a
                    href="https://bit.ly/3KoOXMI"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Onboarding-Gruppe auf Telegram
                  </a>{' '}
                  oder schreib uns an{' '}
                  <a href="mailto:circles@expedition-grundeinkommen.de">
                    circles@expedition-grundeinkommen.de
                  </a>
                </p>
              </>
            )}
            {customUserData && customUserData.email !== '' && (
              <CirclesPink
                lang="de" // app language
                buyVoucherEurLimit={35} // limit of vouchers that can be bought in eur
                theme={xbgeTheme} // app color theme
                xbgeCampaign={true} // enable xbge special components
                xbgeSafeAddress={'0xB9AE1Ce83a6548f1395ddfC36673957B98Eb234D'}
                strictMode={true} // only allow xbge linked safe address restore from localStorage
                safeAddress={savedSafeAddress}
                // ^ linked safeAddress for strict mode check
                voucherShopEnabled={voucherShopEnabled} // enable voucher shop
                onTrackingResumee={(
                  updateResumee: (
                    circlesResumee?: CirclesResumee
                  ) => CirclesResumee
                ) => {
                  const circlesResumee = updateResumee(resumee);
                  if (circlesResumee) {
                    const safeAddress =
                      circlesResumee.safeAddress ||
                      resumee?.safeAddress ||
                      null;
                    const username =
                      circlesResumee.username || resumee?.username || null;
                    const mergedResumee = {
                      ...circlesResumee,
                      username,
                      safeAddress,
                    };
                    saveCirclesTracking(mergedResumee);
                  }
                }} // get tracking resumee with app state
                translations={translations} // json with app text
                email={`user-${userId}@xbge.de`} // email to be send to circles garden
                sharingFeature={
                  customUserData?.store?.circlesResumee?.lastState?.tag !==
                  'Dashboard' ? (
                    <CirclesSharingFeature
                      userData={customUserData}
                      userId={userId}
                    />
                  ) : undefined
                }
                shadowFriends={
                  customUserData.store?.referredByCirclesUsername || []
                } // usernames of share link clicked users
              />
            )}
          </>
        </NoSsr>
      )}
    </>
  );
};

export default Circles;
