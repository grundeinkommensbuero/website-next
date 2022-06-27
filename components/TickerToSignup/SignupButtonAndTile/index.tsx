import React, { useContext } from 'react';
// import AuthContext from '../../../context/Authentication';
import {
  Municipality,
  MunicipalityContext,
} from '../../../context/Municipality';
import {
  UserMunicipalityState,
  useUserMunicipalityState,
} from '../../../hooks/Municipality/UserMunicipalityState';
import s from './style.module.scss';
import cN from 'classnames';
import { SignUpButton } from '../SignupButton';

type SignupButtonAndTileProps = { className?: string };

export const SignupButtonAndTile = ({
  className,
}: SignupButtonAndTileProps) => {
  // const { userId, customUserData: userData } = useContext(AuthContext);
  const { municipality } = useContext(MunicipalityContext);
  const userMunicipalityState = useUserMunicipalityState();

  const welcomeExistingMessage = getWelcomeExistingMessage(municipality);
  const buttonText = getButtonText(municipality, userMunicipalityState);

  if (
    userMunicipalityState === 'loggedOut' ||
    (municipality &&
      userMunicipalityState === 'loggedInOtherMunicipalitySignup')
  ) {
    return (
      <>
        <SignUpButton className={cN(className, s.signUpCTA)}>
          {buttonText}
        </SignUpButton>
      </>
    );
  } else if (
    municipality &&
    userMunicipalityState === 'loggedInNoMunicipalitySignup'
  ) {
    return (
      <>
        <p>Komm dazu.</p>
        <div className={cN(s.tileContainer, 'colorSchemeWhite')}>
          <h3>Willkommen zurück!</h3>
          <p>{welcomeExistingMessage}</p>
          <SignUpButton className={cN(className, s.signUpCTA)}>
            {buttonText}
          </SignUpButton>
        </div>
      </>
    );
  } else {
    return null;
  }
};

export const getButtonText = (
  municipality: Municipality | null,
  userMunicipalityState: UserMunicipalityState
) => {
  if (!municipality) {
    return 'Ich will dabei sein';
  }

  // Berlin
  if (municipality.ags === '11000000') {
    return `Ja, es soll weiter gehen!`;
  }
  // Hamburg
  if (municipality.ags === '02000000') {
    return `Ja, es soll weiter gehen!`;
  }
  // Bremen
  if (municipality.ags === '04011000') {
    return `Ja, es soll weiter gehen!`;
  }

  if (userMunicipalityState === 'loggedInOtherMunicipalitySignup') {
    return 'Sei dabei';
  }

  return `Jetzt in ${municipality.name} anmelden!`;
};

const getWelcomeExistingMessage = (municipality: Municipality | null) => {
  if (!municipality) {
    return '';
  }
  // Berlin
  if (municipality.ags === '11000000') {
    return `Schön, dass du wieder da bist!
    In ${municipality.name} geht die Unterschriftensammlung bald in die zweite Phase. Hilfst du uns dabei, dass es weiter geht?`;
  }

  // Hamburg
  if (municipality.ags === '02000000') {
    return `Schön, dass du wieder da bist!
    In ${municipality.name} geht die Unterschriftensammlung bald in die zweite Phase. Hilfst du uns dabei, dass es weiter geht?`;
  }

  // Bremen
  if (municipality.ags === '04011000') {
    return `Schön, dass du wieder da bist!
    In ${municipality.name} geht die Unterschriftensammlung bald in die zweite Phase. Hilfst du uns dabei, dass es weiter geht?`;
  }

  return `Schön, dass du wieder da bist! Trage dich jetzt für
  ${municipality.name} ein, um das Grundeinkommen in ${municipality.name}
  voran zu bringen!`;
};
