import React, { useState } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import { DirectusImage } from '../Util/DirectusImage';

type HeroProps = {
  heroTitle: string | null;
  heroSubTitle: string | null;
  heroImage: string;
};

export const Hero = ({ heroTitle, heroSubTitle, heroImage }: HeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className={s.heroContainer}>
      <DirectusImage
        onLoad={() => {
          setImageLoaded(true);
        }}
        className={cN(s.heroImage, { [s.imageZoom]: imageLoaded })}
        parentClassName={s.imageContainer}
        assetId={heroImage}
        alt={'Bild der Expedition Grundeinkommen'}
        layout={'fill'}
        priority={true}
      />
      {heroTitle && <h1 className={cN(s.title, s.titles)}>{heroTitle}</h1>}
      {heroSubTitle && (
        <h3 className={cN(s.subTitle, s.titles)}>{heroSubTitle}</h3>
      )}
    </section>
  );
};
