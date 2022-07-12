import Image from 'next/image';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

export const PageLogo = (): ReactElement => {
  const router = useRouter();

  // Would a static image inside the repo make sense here?
  // TODO: link to image in directus, we could also use the so far unused funtion
  // getAssetURL
  return (
    <Image
      src={`${process.env.NEXT_PUBLIC_DIRECTUS}assets/e63d084e-7c28-4675-a007-b299fe684cf4`}
      alt={
        IS_BERLIN_PROJECT
          ? 'Volksentscheid Grundeinkommen Home'
          : 'Expedition Grundeinkommen Home'
      }
      height={80}
      width={200}
      className="cursor-pointer"
      onClick={() => router.push('/')}
    />
  );
};
