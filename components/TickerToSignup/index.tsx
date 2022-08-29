import React, { useContext } from 'react';
import { MunicipalityContext } from '../../context/Municipality';
import { SignupButtonAndTile } from './SignupButtonAndTile';
import { InlineLinkButton } from '../Forms/Button';
import s from './style.module.scss';
import dynamic from 'next/dynamic';
import { List as Loader } from 'react-content-loader';
// import { useUserMunicipalityState } from '../../hooks/Municipality/UserMunicipalityState';

const Ticker = dynamic(() => import('./Ticker'), {
  ssr: true,
  loading: () => <Loader />,
});
const TickerMunicipality = dynamic(
  () => import('./Ticker/TickerMunicipality'),
  { ssr: true, loading: () => <Loader /> }
);

export const TickerToSignup = ({
  tickerDescription: tickerDescriptionObject,
}: {
  tickerDescription: {
    // Why is it in an extra object???
    tickerDescription: string;
  };
}) => {
  const { municipality } = useContext(MunicipalityContext);
  // I deactivated this behaviour for now until it's clear
  // const userMunicipalityState = useUserMunicipalityState();

  // // Don't render this component if user has signed up for this municipality
  // if (userMunicipalityState === 'loggedInThisMunicipalitySignup') {
  //   return null;
  // }

  const tickerDescription: string = tickerDescriptionObject?.tickerDescription;

  return (
    <>
      {/* A hidden Heading to improve accessibility */}
      <h2 className={s.hiddenHeading}>Anmelden</h2>
      {municipality?.ags ? (
        <TickerMunicipality />
      ) : (
        <Ticker tickerDescription={tickerDescription} />
      )}

      <SignupButtonAndTile className={s.centerButton} />
      <div className={s.moreInfo}>
        <InlineLinkButton href="#info">Mehr erfahren</InlineLinkButton>
      </div>
    </>
  );
};

// Default export needed for lazy loading
export default TickerToSignup;
