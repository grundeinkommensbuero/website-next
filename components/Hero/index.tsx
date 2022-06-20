import React, { CSSProperties, ReactElement } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import { DirectusImage } from '../Util/DirectusImage';

type HeroProps = {
  heroTitle: string;
  heroSubTitle: string;
  heroImage: string;
};

export const Hero = ({ heroTitle, heroSubTitle, heroImage }: HeroProps) => {
  return (
    <section className={s.heroContainer}>
      <DirectusImage
        className={s.heroImage}
        parentClassName={s.heroContainer}
        assetId={heroImage}
        alt={'Bild der Expedition Grundeinkommen'}
        layout={'fill'}
        priority={true}
      />
      <h1 className={cN(s.title, s.titles)}>{heroTitle}</h1>
      <h3 className={cN(s.subTitle, s.titles)}>{heroSubTitle}</h3>
    </section>
  );
};
