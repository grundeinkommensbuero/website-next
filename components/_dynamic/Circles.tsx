// TS declaration file will follow soon
//@ts-ignore
import CirclesPink from '@circles-pink/web-client';
import { useContext } from 'react';
import AuthContext from '../../context/Authentication';
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
  const { userId, isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? (
    <NoSsr>
      <CirclesPink
        lang="de"
        theme={xbgeTheme}
        email={`user-${userId}@xbge.de`}
        voucherServerEnabled={false}
      />
    </NoSsr>
  ) : (
    <>
      <p>
        Bitte gib deine E-Mail-Adresse an. Wenn du schon bei der Expedition
        angemeldet bist, nimm bitte deine Expeditions-Adresse.
      </p>
      <SmallSignup />
    </>
  );
};

export default Circles;
