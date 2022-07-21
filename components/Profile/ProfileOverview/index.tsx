import React, { useEffect, useState } from 'react';
import AvatarImage from '../../AvatarImage';
import SignatureStats from '../../SignatureStats';
import { formatDate } from '../../../utils/date';
import s from './style.module.scss';
import gS from '../style.module.scss';
import cN from 'classnames';
import { getReferredUserMessage } from '../utils/referredUserMessage';
import { getCustomNewsletterEnumeration } from '../utils/customNewsletterEnumeration';
import { User } from '../../../context/Authentication';
import Link from 'next/link';
import { SignatureCount } from '../../../hooks/Api/Signatures/Get';
import { stateToAgs } from '../../../utils/stateToAgs';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

type ProfileOverviewProps = {
  userData: User;
  userId: string;
  signatureCountOfUser: SignatureCount | null;
};

export const ProfileOverview = ({
  userData,
  userId,
  signatureCountOfUser,
}: ProfileOverviewProps) => {
  const [pledgePackages, setPledgePackages] = useState<any>([]);

  // list newsletters of current user as human readable string
  const customNewsletterEnumeration = getCustomNewsletterEnumeration({
    userData,
  });
  // list referred users, if any
  const referredUserMessage = getReferredUserMessage({ userData });

  const isSignedUpForBerlin =
    userData.municipalities?.findIndex(
      ({ ags }) => ags === stateToAgs['berlin']
    ) !== -1;

  // const isSignedUpForBremen =
  //   userData.municipalities?.findIndex(
  //     ({ ags }) => ags === stateToAgs['bremen']
  //   ) !== -1;

  const showPackageSection = IS_BERLIN_PROJECT || isSignedUpForBerlin;
  // Filter interactions to only use interactions which were created
  // as pledge package
  useEffect(() => {
    if (userData?.interactions) {
      setPledgePackages(
        userData.interactions.filter(
          interaction => interaction.type === 'pledgePackage'
        )
      );
    }
  }, [userData]);

  return (
    <section className={gS.profilePageGrid}>
      <Link href={`/mensch/${userId}/stammdaten`} passHref shallow>
        <section
          className={cN(
            s.profilePageSection,
            s.profilePageSectionLarge,
            gS.userInfo,
            {
              [s.rose]: IS_BERLIN_PROJECT,
            }
          )}
        >
          <AvatarImage user={userData} className={gS.avatar} />
          <div>
            <h2 className={cN({ [gS.username]: userData.username })}>
              {userData.username || userData.email}
            </h2>
            <div className={gS.placeInfo}>{userData.city}</div>
            <div className={gS.details}>
              Dabei seit dem{' '}
              {userData.createdAt && formatDate(new Date(userData.createdAt))}
            </div>
            {referredUserMessage && (
              <div className={s.referredUsersMessage}>
                {referredUserMessage}
              </div>
            )}
          </div>
          <div className={s.sectionLink}>
            <span>Stammdaten bearbeiten</span>
          </div>
        </section>
      </Link>

      <Link href={`/mensch/${userId}/spenden-einstellungen`} passHref>
        <section
          className={cN(s.profilePageSection, {
            [s.rose]: IS_BERLIN_PROJECT,
          })}
        >
          <h2 className={s.profileHeadline}>Spenden-Einstellungen</h2>
          {userData?.donations?.recurringDonation?.amount > 0 ? (
            <h4>
              Du bist Dauerspender*in.
              <br />
              Vielen Dank!
            </h4>
          ) : (
            <p>Hier kannst du deine Spende verwalten.</p>
          )}
          <div className={s.sectionLink}>
            <span>Spendeneinstellungen ändern</span>
          </div>
        </section>
      </Link>

      <Link href={`/mensch/${userId}/kontakt-einstellungen`} passHref>
        <section
          className={cN(s.profilePageSection, {
            [s.rose]: IS_BERLIN_PROJECT,
          })}
        >
          <h2 className={s.profileHeadline}>Newsletter & Kontakt</h2>
          {customNewsletterEnumeration.length > 0 ? (
            <>
              <p>Du erhältst folgende Newsletter: </p>
              <p>{customNewsletterEnumeration}</p>
            </>
          ) : (
            <p>Du erhältst keinen Newsletter von uns.</p>
          )}
          <div className={s.sectionLink}>
            <span>Einstellungen ändern</span>
          </div>
        </section>
      </Link>

      <Link href={`/mensch/${userId}/unterschriften-eintragen`} passHref>
        <section
          className={cN(
            s.profilePageSection,
            s.profilePageSectionLarge,
            s.signaturesSection,
            {
              [s.rose]: IS_BERLIN_PROJECT,
            }
          )}
        >
          <h2 className={s.profileHeadline}>Eingegangene Unterschriften</h2>
          {signatureCountOfUser && (
            <>
              <SignatureStats
                signatureCount={signatureCountOfUser}
                className={s.signatureStats}
                layout="horizontal"
              />
              <div className={s.sectionLink}>
                <span>Mehr sehen und eintragen</span>
              </div>
            </>
          )}
        </section>
      </Link>

      {/* Only show this section if user is signed up for berlin or if berlin page */}
      {showPackageSection && (
        <Link href={`/mensch/${userId}/unterschriften-eintragen`} passHref>
          <section
            className={cN(
              s.profilePageSection,
              s.profilePageSectionLarge,
              s.signaturesSection,
              {
                [s.rose]: IS_BERLIN_PROJECT,
              }
            )}
          >
            <h2>Dein Sammelpaket</h2>
            <p>
              {pledgePackages.length ? (
                <>
                  Du hast dir {pledgePackages.length} Paket
                  {pledgePackages.length > 1 && 'e'} geschnappt und somit
                  versprochen, {pledgePackages.length * 25} Unterschriften zu
                  sammeln.
                  <br />
                  <br />
                  {/* TODO: design package */}
                  {/* Find package with message if exists to show this package (maybe in the future
                    show most recent (was kinda in a hurry) */}
                  &quot;
                  {
                    pledgePackages.find(
                      (pledgePackage: any) => pledgePackage.body
                    )?.body
                  }
                  &quot;
                </>
              ) : (
                <>Du hast noch kein Sammelpaket genommen.</>
              )}
            </p>
            <div className={s.sectionLink}>
              <span>
                {pledgePackages.length
                  ? 'Weiteres Paket nehmen'
                  : 'Nimm dein Paket'}
              </span>
            </div>
          </section>
        </Link>
      )}

      {/* {signatureCountOfUser && (
        <a className={cN(s.profilePageSection, s.profilePageSectionLarge)}
          href={`/${signatureCountOfUser.mostRecentCampaign
            ? SELF_SCAN_SLUGS[
            signatureCountOfUser.mostRecentCampaign.state
            ]
            : 'qr/b' // if user has no recent campaign default is just berlin
            }?userId=${userId}`}
        >
          <section className={s.signaturesSection}>
            <h2 className={s.profileHeadline}>Eingegangene Unterschriften</h2>
            {signatureCountOfUser && (
              <>
                <SignatureStats
                  signatureCount={signatureCountOfUser}
                  className={s.signatureStats}
                  layout="horizontal"
                />

                <div className={s.sectionLink}>
                  <span>
                    Mehr sehen und eintragen
                  </span>
                </div>
              </>
            )}
          </section>
        </a>
      )} */}
    </section>
  );
};
