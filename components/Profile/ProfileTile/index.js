import React, { useContext } from 'react';
import { Link, navigate } from 'gatsby';
import AuthContext from '../../../context/Authentication';
import { MunicipalityContext } from '../../../context/Municipality';
import { useUserMunicipalityState } from '../../../hooks/Municipality/UserMunicipalityState';
import AvatarImage from '../../AvatarImage';
import { Button } from '../../Forms/Button';
import { formatDate } from '../../utils';
import s from './style.module.scss';
import * as cS from '../../style/colorSchemes.module.less';
import cN from 'classnames';
import { getReferredUserMessage } from '../utils/referredUserMessage';

export const ProfileTile = ({ children }) => {
  const { userId, customUserData: userData } = useContext(AuthContext);
  const { municipality, setMunicipality, municipalityContentfulState } =
    useContext(MunicipalityContext);
  const tileData = {
    userId,
    userData,
    municipality,
    children,
    setMunicipality,
  };

  const userMunicipalityState = useUserMunicipalityState();

  if (userMunicipalityState === 'loggedInThisMunicipalitySignup') {
    return <TileLoggedInThisMunicipality {...tileData} />;
  }
  if (
    municipalityContentfulState === 'noMunicipality' &&
    userMunicipalityState === 'loggedInOtherMunicipalitySignup'
  ) {
    return <TileNoMunicipalityLoggedInOtherMunicipality {...tileData} />;
  }
  if (
    userMunicipalityState === 'loggedInNoMunicipalitySignup' &&
    municipalityContentfulState === 'noMunicipality'
  ) {
    return <WelcomeBack {...tileData} />;
  }
  if (
    municipalityContentfulState !== 'noMunicipality' &&
    userMunicipalityState === 'loggedInOtherMunicipalitySignup'
  ) {
    // NOTE: if TileMunicipalityLoggedInOtherMunicipality is used in the future it would need
    // to be redesigned
    return null;
    // return <TileMunicipalityLoggedInOtherMunicipality {...tileData} />;
  }
  return <></>;
};

const TileLoggedInThisMunicipality = ({ userId, userData, municipality }) => {
  const referredUserMessage = getReferredUserMessage({ userData });

  return (
    <>
      {userData && (
        <section>
          <div className={cN(s.tileFlexContainer, cS.colorSchemeViolet)}>
            <div className={s.centeredAvatar}>
              <AvatarImage user={userData} className={s.avatar} />
            </div>
            <div className={s.flexElementOnlyInfo}>
              <div className={s.info}>
                <h3 className={cN(s.headline, s.centerDesktop, s.centerMobile)}>
                  {userData.username}
                </h3>
                <ul className={cN(s.infoText, s.centerDesktop, s.centerMobile)}>
                  <li
                    className={cN(s.centerDesktop, s.centerMobile, s.userCity)}
                  >
                    {userData.city}
                  </li>
                  <li
                    className={cN(
                      s.centerDesktop,
                      s.centerMobile,
                      s.userCreated
                    )}
                  >
                    Dabei seit dem{' '}
                    {userData.createdAt &&
                      formatDate(new Date(userData.createdAt))}
                  </li>
                </ul>
              </div>
              {municipality && (
                <p>
                  Du hast dich für {municipality.name} angemeldet. Schön, dass
                  du dabei bist!
                </p>
              )}
              <p>
                <Link to={`/mensch/${userId}`}>Besuche dein Profil</Link>, um
                deine Einstellungen zu ändern.
              </p>
            </div>
          </div>
          <div>
            {referredUserMessage && (
              <div className={s.referredUsersMessage}>
                {referredUserMessage}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

const TileNoMunicipalityLoggedInOtherMunicipality = ({
  userId,
  userData,
  setMunicipality,
}) => {
  return (
    <>
      {userData && (
        <div className={s.tileContainer}>
          <div className={cN(s.tileFlexContainer, cS.colorSchemeWhite)}>
            <div className={s.flexElement}>
              <h3 className={s.headline}>Hallo {userData.username}! </h3>

              <p>Du bist bereits in folgenden Orten angemeldet:</p>
              <div className={s.municipalityButtonGroup}>
                {userData.municipalities &&
                  userData.municipalities.map((municipality, index) => {
                    if (index <= 1) {
                      return (
                        <div key={municipality.ags}>
                          <p className={s.municipalityLabel}>
                            {municipality.name}
                          </p>
                          <Button
                            onClick={() => {
                              navigate(`/orte/${municipality.slug}`);
                            }}
                          >
                            Zur Seite von {municipality.name}
                          </Button>
                        </div>
                      );
                    }
                    return null;
                  })}
              </div>
            </div>
            <div className={s.flexElement}>
              <div className={s.avatarAndInfo}>
                <div>
                  <AvatarImage user={userData} className={s.avatar} />
                </div>

                <div className={s.info}>
                  <h3 className={cN(s.headline, s.centerMobile)}>
                    {userData.username}
                  </h3>
                  <ul className={cN(s.infoText, s.centerMobile)}>
                    <li className={s.centerMobile}>{userData.city}</li>
                    <li className={s.centerMobile}>
                      Dabei seit dem{' '}
                      {userData.createdAt &&
                        formatDate(new Date(userData.createdAt))}
                    </li>
                  </ul>
                </div>
              </div>

              <p>
                <Link to={`/mensch/${userId}`}>Besuche dein Profil</Link>, um
                deine Einstellungen zu ändern.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// NOTE: if TileMunicipalityLoggedInOtherMunicipality is used in the future it would need
/*
const TileMunicipalityLoggedInOtherMunicipality = ({
  userId,
  userData,
  municipality,
}) => {
  return (
    <>
      {userData && (
        <div className={cN(s.tileContainer, cS.colorSchemeWhite)}>
          <div className={s.flexElement}>
            <h3 className={s.headline}>Hallo {userData.username}! </h3>

            <p>Du bist bereits in folgenden Orten angemeldet:</p>
            <div className={s.municipalityButtonGroup}>
              {userData.municipalities &&
                userData.municipalities.map(municipality => {
                  return (
                    <div key={municipality.ags}>
                      <p className={s.municipalityLabel}>{municipality.name}</p>
                    </div>
                  );
                })}
            </div>
            {municipality && (
              <>
                <p>
                  Möchtest du dich auch in {municipality.name} anmelden und auf
                  dem Laufenden gehalten werden?
                </p>
                <p>
                  Du kannst dich jederzeit in deinem Profil wieder abmelden.
                </p>
                <SignUpButton>
                  {`In ${municipality.name} anmelden`}
                </SignUpButton>
              </>
            )}
          </div>
          <div className={s.avatarAndInfo}>
            <div>
              <AvatarImage user={userData} className={s.avatar} />
            </div>

            <div className={s.info}>
              <h3 className={cN(s.headline, s.centerMobile)}>
                {userData.username}
              </h3>
              <ul className={cN(s.infoText, s.centerMobile)}>
                <li className={s.centerMobile}>{userData.city}</li>
                <li className={s.centerMobile}>
                  Dabei seit dem{' '}
                  {userData.createdAt &&
                    formatDate(new Date(userData.createdAt))}
                </li>
              </ul>
            </div>
            <div>
              <p>Besuche dein Profil, um deine Einstellungen zu ändern.</p>
              <LinkButtonLocal to={`/mensch/${userId}`}>
                Zum Profil
              </LinkButtonLocal>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
*/

export const WelcomeBack = ({ children }) => {
  return (
    <div className={cN(s.tileContainer, cS.colorSchemeWhite)}>
      <div>
        <h3>Willkommen zurück!</h3>
        <p>
          Schön, dass du wieder da bist! Wie du siehst, hat sich bei uns einiges{' '}
          verändert! Melde dich für deinen Wohnort an, um mitzuhelfen, das{' '}
          Grundeinkommen bei dir vor Ort voran zu bringen.
        </p>
        <div>{children}</div>
      </div>
    </div>
  );
};

// Default export needed for lazy loading
export default ProfileTile;
