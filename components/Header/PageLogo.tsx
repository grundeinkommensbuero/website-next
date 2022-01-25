import Image from 'next/image';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';

export const PageLogo = (): ReactElement => {
  const router = useRouter();

  return (
    <Image
      src={`${process.env.NEXT_PUBLIC_DIRECTUS}assets/74ad5cd6-c61a-4c08-a8a6-ea5530fc05bd`}
      alt='Logo der Expedition Grundeinkommen'
      height='500rem'
      width='230rem'
      className='cursor-pointer'
      onClick={() => router.push('/')}
    />
  );
};
