import React, { useState } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import { DirectusImage } from '../Section';
import Image from 'next/image';
import { getAssetURL } from '../Util/getAssetURL';

type HeroProps = {
  heroTitle: string | null;
  heroSubTitle: string | null;
  heroImage: string | null;
};

export const Hero = ({ heroTitle, heroSubTitle, heroImage }: HeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const IS_HAMBURG_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Hamburg';

  return (
    <section>
      {IS_HAMBURG_PROJECT ? (
        <div className={s.heroHamburg}>
          <div className={s.heroHamburgMain}>
            {heroImage && (
              <div>
                <Image
                  className={s.heroImageHamburg}
                  src={getAssetURL(heroImage)}
                  alt={'Briefi auf dem Weg zum Wahllokal'}
                  width={500}
                  height={400}
                  priority={true}
                />
              </div>
            )}
            {heroSubTitle && (
              <h3 className={s.heroSubtitleHamburg}>{heroSubTitle}</h3>
            )}
            {heroTitle && <h1 className={s.heroTitleHamburg}>{heroTitle}</h1>}
          </div>
          <div className={s.heroHamburgSecondary}>
            <div className={cN(s.heroHamburgHalf, s.heroHamburgLeft)}>
              <h3>Informieren</h3>
              <p>
                Kann das Grundeinkommen uns als Gesellschaft weiterbringen?
                Testen wir es doch einfach! Per Volksentscheid wollen wir einen
                staatlich finanzierten Modellversuch möglich machen, um genau
                diese Frage zu beantworten.
              </p>
            </div>
            <div className={cN(s.heroHamburgHalf, s.heroHamburgRight)}>
              <h3>Mitmachen</h3>
              <p>
                Wir brauchen deine Unterstützung! Um den Volksentscheid zu
                gewinnen, müssen mindestens 265.000 Hamburger*innen dafür
                stimmen. Sei dabei und hilf mit, dieses Ziel zu erreichen!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <section className={s.heroContainer}>
          {heroImage && (
            <div className={s.imageContainer}>
              <Image
                onLoad={() => {
                  setImageLoaded(true);
                }}
                className={cN(s.heroImage, { [s.imageZoom]: imageLoaded })}
                src={getAssetURL(heroImage)}
                alt={
                  'Bild der Unterschriftensammlung von Hamburg testet Grundeinkommen'
                }
                layout={'fill'}
                priority={true}
              />
            </div>
          )}
          {heroTitle && <h1 className={cN(s.title, s.titles)}>{heroTitle}</h1>}
          {heroSubTitle && (
            <h3 className={cN(s.subTitle, s.titles)}>{heroSubTitle}</h3>
          )}
        </section>
      )}
    </section>
  );
};
