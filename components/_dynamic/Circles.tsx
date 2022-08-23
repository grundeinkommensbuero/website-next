// TS declaration file will follow soon
//@ts-ignore
import CirclesPink from '@circles-pink/web-client';
import { useContext } from 'react';
import AuthContext, { CirclesResumee } from '../../context/Authentication';
import { useUpdateUser } from '../../hooks/Api/Users/Update';
import { SmallSignup } from '../Forms/SmallSignup';
import { NoSsr } from '../Util/NoSsr';

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
  const [, updateUserStore] = useUpdateUser();

  const saveCirclesTracking = (circlesResumee: CirclesResumee) => {
    updateUserStore({
      userId: userId,
      store: {
        circlesResumee,
      },
    });
    updateCustomUserData();
  };

  const resumee: CirclesResumee | undefined =
    customUserData?.store?.circlesResumee;

  return isAuthenticated ? (
    <NoSsr>
      <>
        {customUserData && (
          <p>
            Hallo{customUserData.username ? ` ${customUserData.username}` : ''}!
            Du bist mit der E-Mail-Adresse {customUserData.email} bei uns
            eingeloggt.{' '}
          </p>
        )}
        <CirclesPink
          lang="de"
          theme={xbgeTheme}
          email={`user-${userId}@xbge.de`}
          voucherServerEnabled={false}
          xbgeCampaign={true}
          key={userId || 'Not-Authenticated'}
          onTrackingResumee={(
            updateResumee: (circlesResumee?: CirclesResumee) => CirclesResumee
          ) => {
            const circlesResumee = updateResumee(resumee);
            saveCirclesTracking(circlesResumee);
          }}
        />
      </>
    </NoSsr>
  ) : (
    <>
      <p>
        Bitte gib deine E-Mail-Adresse an. Wenn du schon bei der Expedition
        angemeldet bist, nimm bitte deine Expeditions-Adresse.
      </p>
      <SmallSignup loginCodeInModal={false} />
    </>
  );
};

export default Circles;
