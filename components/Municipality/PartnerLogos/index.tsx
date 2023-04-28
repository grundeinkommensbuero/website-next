import React from 'react';
import s from './style.module.scss';
import cN from 'classnames';

import DiwLogo from './logo-diw.svg';
import XbgeLogo from './logo-xbge-white.svg';

// import { useUserMunicipalityState } from '../../../hooks/Municipality/UserMunicipalityState';
import { SignupButtonAndTile } from '../../TickerToSignup/SignupButtonAndTile';
import Image from 'next/image';

export const PartnerLogos = () => {
  // I deactivated this behaviour for now until it's clear
  // how the municipality pages should look like going forward
  // const userMunicipalityState = useUserMunicipalityState();

  // // Don't render this component if user has signed up for this municipality
  // if (userMunicipalityState === 'loggedInThisMunicipalitySignup') {
  //   return null;
  // }

  return (
    <div>
      <p className={s.introText}>
        Gemeinsam mit dir und starken Partnern starten wir einen staatlichen
        Modellversuch zum Grundeinkommen in Hamburg. Demokratisch beschlossen.
        Mit 2.000 Teilnehmenden.
      </p>
      <p className={s.introText}>Bist du dabei?</p>
      <SignupButtonAndTile className={s.centerButton} />
      <div className={s.logoContainer}>
        <div className={cN(s.partnerLogo, s.diwLogo)}>
          <DiwLogo alt="Logo Deutsches Institut für Wirtschaftsforschung" />
        </div>
        <div className={cN(s.partnerLogo, s.changeLogo)}>
          <Image
            width={525}
            height={198}
            src="/442A4C9C-4D80-41BE-ACC7-5C2E8D694798.png"
            alt="Logo innn.it"
          />
        </div>
        <div className={cN(s.partnerLogo, s.fribisLogo)}>
          <Image
            width={446}
            height={140}
            src="/logo-fribis.png"
            alt="Logo Freiburg Institute for Basic Income Studies"
          />
        </div>
        <div className={cN(s.partnerLogo, s.xbgeLogo)}>
          <XbgeLogo alt="Logo Expedition Grundeinkommen" />
        </div>
      </div>{' '}
    </div>
  );
};
