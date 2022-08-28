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
import { LoadingAnimation } from '../LoadingAnimation';

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

  const [initPhase, setInitPhase] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      // To wait for the safeAddress this timeout is a workaround
      setInitPhase(false);
    }, 1000);
  });

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
      const { username } = querystring.parse(window.location.search);

      if (typeof username === 'string') {
        let usernames = customUserData.store?.referredByCirclesUsername || [];

        usernames.push(username);

        updateUserStore({
          userId,
          store: {
            referredByCirclesUsername: usernames,
          },
        });
      }
    }
  }, [isAuthenticated, customUserData]);

  if (initPhase) {
    return <LoadingAnimation />;
  }

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
        optionalNewsletterConsent={true}
        hideIfAuthenticated={true}
      />
      {isAuthenticated && (
        <NoSsr>
          <>
            {customUserData && (
              <p>
                Hallo
                {customUserData.username ? ` ${customUserData.username}` : ''}!
                Du bist mit der E-Mail-Adresse {customUserData.email} bei uns
                eingeloggt.{' '}
              </p>
            )}
            {customUserData && (
              <CirclesPink
                lang="de" // app language
                buyVoucherEurLimit={70} // limit of vouchers that can be bought in eur
                theme={xbgeTheme} // app color theme
                xbgeCampaign={true} // enable xbge special components
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
                  <>
                    <p>
                      Wenn du Hilfe brauchst, komm einfach in unsere{' '}
                      <a
                        href="https://bit.ly/3KoOXMI"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Telegram-Onboarding-Gruppe
                      </a>
                    </p>
                    {/* <CirclesSharingFeature
                     userData={customUserData}
                     userId={userId}
                     introText={'Hello'}
                   /> */}
                  </>
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
