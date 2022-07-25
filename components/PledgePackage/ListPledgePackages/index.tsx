import React, { useContext, useEffect, useState } from 'react';
import s from './style.module.scss';
import {
  InteractionWithUser,
  useGetMostRecentInteractions,
} from '../../../hooks/Api/Interactions';

import { CTALink } from '../../Forms/CTAButton';
import AuthContext from '../../../context/Authentication';

import { LoadingAnimation } from '../../LoadingAnimation';
import { Package } from './Package';

const ListPledgePackages = () => {
  const [state, pledgePackages, getInteractions] =
    useGetMostRecentInteractions();
  const { customUserData: userData } = useContext(AuthContext);
  const [packagesOfUser, setPackagesOfUser] = useState<InteractionWithUser[]>(
    []
  );
  const [pledgePackagesDone, setPledgePackagesDone] = useState<
    InteractionWithUser[]
  >([]);

  // Fetch all interactions once
  useEffect(() => {
    getInteractions(null, 0, 'pledgePackage');
  }, []);

  // Get a list of all done packages
  useEffect(() => {
    const done = pledgePackages.filter(pledgePackage => pledgePackage.done);
    setPledgePackagesDone(done);
  }, [pledgePackages]);

  // Get only pledge packages from user interactions
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
    <section>
      <h2 className={s.violet}>Alle Sammelpakete</h2>
      <p>
        Zeig deinen Einsatz für&apos;s Grundeinkommen und setze dir ein
        Sammelziel! Es gibt Pakete mit jeweils einem Ziel von 25 Unterschriften,
        von denen du dir so viele nehmen kannst, wie du möchtest!{' '}
        {userData.interactions &&
          packagesOfUser.length === 0 &&
          'Mach mit und schnapp dir dein erstes Paket!'}
      </p>

      {state && state !== 'loading' && (
        <p>
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
      )}

      {packagesOfUser.length > 0 && (
        <div>
          <h3 className={s.violet}>Deine Pakete</h3>
          <p>
            Du hast dir {packagesOfUser.length} Paket
            {packagesOfUser.length > 1 && 'e'} geschnappt und somit versprochen,{' '}
            {packagesOfUser.length * 25} Unterschriften zu sammeln.
          </p>
          <div className={s.container}>
            {packagesOfUser.map((pledgePackage, index) => {
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
        </div>
      )}

      <div className={s.CTA}>
        <CTALink to={`/me/paket-nehmen`}>
          {userData && packagesOfUser.length === 0
            ? 'Nimm dein Paket'
            : 'Weiteres Paket nehmen'}
        </CTALink>
      </div>

      {state && state !== 'loading' ? (
        <>
          {pledgePackages.length > 0 ? (
            <h3 className={s.violet}>
              Diese Pakete hat sich schon jemand geschnappt
            </h3>
          ) : (
            <h3 className={s.violet}>Noch keine Pakete verteilt!</h3>
          )}

          <div className={s.container}>
            {pledgePackages.map((pledgePackage, index) => {
              return <Package key={index} {...pledgePackage} />;
            })}
          </div>

          {pledgePackagesDone.length > 0 && (
            <>
              <h3 className={s.violet}>Diese Pakete wurden schon erledigt!</h3>
              <div className={s.container}>
                {pledgePackagesDone.map((pledgePackage, index) => {
                  return (
                    <Package key={index} showDone={true} {...pledgePackage} />
                  );
                })}
              </div>
            </>
          )}
        </>
      ) : (
        <LoadingAnimation />
      )}
    </section>
  );
};

export default ListPledgePackages;
