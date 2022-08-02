import React, { useState } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import { DirectusImage } from '../Section';
import Image from 'next/image';

type HeroProps = {
  heroTitle: string | null;
  heroSubTitle: string | null;
  heroImage: DirectusImage;
};

export const Hero = ({ heroTitle, heroSubTitle, heroImage }: HeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className={s.heroContainer}>
      <div className={s.imageContainer}>
        <Image
          onLoad={() => {
            setImageLoaded(true);
          }}
          className={cN(s.heroImage, { [s.imageZoom]: imageLoaded })}
          src={heroImage.id}
          alt={'Bild der Expedition Grundeinkommen'}
          layout={'fill'}
          priority={true}
        />
      </div>
      {heroTitle && <h1 className={cN(s.title, s.titles)}>{heroTitle}</h1>}
      {heroSubTitle && (
        <h3 className={cN(s.subTitle, s.titles)}>{heroSubTitle}</h3>
      )}
    </section>
  );
};
