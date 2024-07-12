import React, { useState } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import { DirectusImage } from '../Section';
import Image from 'next/image';
import { getAssetURL } from '../Util/getAssetURL';

type HeroProps = {
  heroHTML: string | null;
  heroTitle: string | null;
  heroSubTitle: string | null;
  heroImage: string | null;
};

export const Hero = ({
  heroHTML,
  heroTitle,
  heroSubTitle,
  heroImage,
}: HeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className={s.heroContainer}>
      {heroImage && (
        <div className={s.imageContainer}>
          <Image
            onLoad={() => {
              setImageLoaded(true);
            }}
            className={cN(s.heroImage, { [s.imageZoom]: imageLoaded })}
            src={getAssetURL(heroImage)}
            alt={'Bild der Expedition Grundeinkommen'}
            layout={'fill'}
            priority={true}
          />
        </div>
      )}
      {heroTitle && <h1 className={cN(s.title, s.titles)}>{heroTitle}</h1>}
      {heroSubTitle && (
        <h3 className={cN(s.subTitle, s.titles)}>{heroSubTitle}</h3>
      )}
      {/* see https://legacy.reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml and https://blog.logrocket.com/using-dangerouslysetinnerhtml-react-application/ */}
      {heroHTML && (
        <div
          className={s.heroHTMLContainer}
          dangerouslySetInnerHTML={{ __html: heroHTML }}
        />
      )}
    </section>
  );
};
