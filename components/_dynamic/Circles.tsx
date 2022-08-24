// TS declaration file will follow soon
//@ts-ignore
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
  const [resumee, setResumee] = useState<CirclesResumee | undefined>(
    customUserData?.store?.circlesResumee
  );

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
    setResumee(customUserData?.store?.circlesResumee);
  }, [customUserData]);

  useEffect(() => {
    // Only update user, if custom user data was loaded
    // so existing referred safe addresses are not overwritten
    if (isAuthenticated && customUserData.email) {
      const { safeAddress } = querystring.parse(window.location.search);

      if (typeof safeAddress === 'string') {
        let safeAddresses = customUserData.store?.referredBySafeAddresses || [];

        safeAddresses.push(safeAddress);

        updateUserStore({
          userId,
          store: {
            referredBySafeAddresses: safeAddresses,
          },
        });
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
            <CirclesPink
              lang="de" // app language
              theme={xbgeTheme} // app color theme
              xbgeCampaign={true} // enable xbge special components
              strictMode={true} // only allow xbge linked safe address restore from localStorage
              safeAddress={customUserData?.store?.circlesResumee?.safeAddress}
              // ^ linked safeAddress for strict mode check
              voucherShopEnabled={
                customUserData.store?.voucherStoreEnabled || false
              } // enable voucher shop
              onTrackingResumee={(
                updateResumee: (
                  circlesResumee?: CirclesResumee
                ) => CirclesResumee
              ) => {
                const circlesResumee = updateResumee(resumee);
                saveCirclesTracking(circlesResumee);
              }} // get tracking resumee with app state
              translations={translations} // json with app text
              email={`user-${userId}@xbge.de`} // email to be send to circles garden
              // sharingFeature={
              //   <CirclesSharingFeature
              //     userData={customUserData}
              //     userId={userId}
              //     introText={'Hello'}
              //   />
              // }
            />
          </>
        </NoSsr>
      )}
    </>
  );
};

export default Circles;
