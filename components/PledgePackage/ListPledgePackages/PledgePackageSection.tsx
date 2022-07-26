import React, { useState, useEffect, useContext } from 'react';
import s from './style.module.scss';
import AuthContext from '../../../context/Authentication/index';
import {
  InteractionWithUser,
  useGetMostRecentInteractions,
} from '../../../hooks/Api/Interactions';
import { LoadingAnimation } from '../../LoadingAnimation';
import { Package } from './Package';
import { CTALink } from '../../Forms/CTAButton';
import { Button } from '../../Forms/Button';
import { OnboardingModalContext } from '../../../context/OnboardingModal/index';
import paketSvg from '../paket-v2.svg';

export const PledgePackagesSection = () => {
  const [state, pledgePackages, getInteractions] =
    useGetMostRecentInteractions();
  const [pledgePackagesDone, setPledgePackagesDone] = useState<
    InteractionWithUser[]
  >([]);
  const {
    customUserData: userData,
    isAuthenticated,
    userId,
  } = useContext(AuthContext);
  const [packagesOfUser, setPackagesOfUser] = useState<InteractionWithUser[]>(
    []
  );
  const { setShowModal } = useContext(OnboardingModalContext);

  // Fetch all interactions once
  useEffect(() => {
    getInteractions(null, 0, 'pledgePackage');
  }, []);

  // Get a list of all done packages
  useEffect(() => {
    const done = pledgePackages.filter(pledgePackage => pledgePackage.done);
    setPledgePackagesDone(done);
  }, [pledgePackages]);

  useEffect(() => {
    if (userData?.interactions) {
      setPackagesOfUser(
        userData.interactions.filter(
          interaction => interaction.type === 'pledgePackage'
        )
      );
    }
  }, [userData]);

  return (
    <>
      <h2 className={s.violet}>Schnapp dir ein Sammelpaket</h2>
      {state && state !== 'loading' ? (
        <div className={s.flexContainer}>
          <div className={s.flexItem}>
            {packagesOfUser.length === 0 ? (
              <>
                <p>
                  Zeig deinen Einsatz für&apos;s Grundeinkommen und setze dir
                  ein Sammelziel! Es gibt Pakete mit jeweils einem Ziel von 50
                  Unterschriften, von denen du dir so viele nehmen kannst, wie
                  du möchtest! Mach mit und schnapp dir dein erstes Paket!
                </p>
                <img src={paketSvg} alt="Symbolbild eines Paketes" />
              </>
            ) : (
              <p>
                Du hast dir {packagesOfUser.length} Paket
                {packagesOfUser.length > 1 && 'e'} geschnappt und somit
                versprochen, {packagesOfUser.length * 25} Unterschriften zu
                sammeln.
              </p>
            )}
            {packagesOfUser.length !== 0 && (
              <div className={s.packagesColumnLeft}>
                {packagesOfUser
                  .slice()
                  .reverse()
                  .slice(0, 2)
                  .map((pledgePackage, index) => {
                    return (
                      <Package
                        belongsToCurrentUser={true}
                        key={index}
                        {...pledgePackage}
                        user={userData as any}
                      />
                    );
                  })}
              </div>
            )}
            <div className={s.CTA}>
              {isAuthenticated ? (
                <CTALink to={`/mensch/${userId}/paket-nehmen`}>
                  {userData && packagesOfUser.length === 0
                    ? 'Nimm dein Paket'
                    : 'Weiteres Paket nehmen'}
                </CTALink>
              ) : (
                <Button
                  aria-label="Anmelden"
                  onClick={() => setShowModal(true)}
                >
                  Hier kannst du dich anmelden.
                </Button>
              )}
            </div>
          </div>
          <div className={s.flexItem}>
            <p className={s.violet}>
              {pledgePackages[0] ? (
                <b>
                  Schon {pledgePackages.length} Pakete mit insgesamt{' '}
                  {pledgePackages.length * 25} Unterschriften verteilt
                  {pledgePackagesDone.length > 0 &&
                    ` - und davon ${pledgePackagesDone.length} Paket${
                      pledgePackagesDone.length > 1 ? 'e' : ''
                    } erledigt`}
                  !
                </b>
              ) : (
                <b>Noch keine Pakete verteilt!</b>
              )}
            </p>
            <div className={s.packagesColumnRight}>
              {pledgePackages.slice(0, 3).map((pledgePackage, index) => {
                return <Package key={index} {...pledgePackage} />;
              })}
            </div>
            <div className={s.CTA}>
              <CTALink to={`/pakete`}>Alle ansehen</CTALink>
            </div>
          </div>
        </div>
      ) : (
        <LoadingAnimation />
      )}
    </>
  );
};
