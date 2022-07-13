import { ReactElement } from 'react';
import { LogoExpedition } from '../LogoExpedition';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

export const PageLogo = (): ReactElement => {
  return (
    <LogoExpedition
      className="cursor-pointer h-12"
      color="black"
      alt={
        IS_BERLIN_PROJECT
          ? 'Volksentscheid Grundeinkommen Home'
          : 'Expedition Grundeinkommen Home'
      }
    />
  );
};
