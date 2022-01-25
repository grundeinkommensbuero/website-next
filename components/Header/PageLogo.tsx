import Image from 'next/image';
import { ReactElement } from 'react';

export const PageLogo = (): ReactElement => {
  return (
    <Image
      src={`https://xbge-directus.frac.tools/assets/74ad5cd6-c61a-4c08-a8a6-ea5530fc05bd`}
      alt='Logo der Expedition Grundeinkommen'
      height='500rem'
      width='230rem'
    />
  );
};
