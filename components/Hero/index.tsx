import React, { useState } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import { DirectusImage } from '../Section';
import Image from 'next/image';
import { getAssetURL } from '../Util/getAssetURL';
import { CTAButtonContainer, CTALink } from '../Forms/CTAButton';

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
              <div className={s.heroHamburgImage}>
                <Image
                  className={s.heroImageHamburg}
                  src={getAssetURL(heroImage)}
                  alt={'Briefi auf dem Weg zum Wahllokal'}
                  width={400}
                  height={400}
                  objectFit="contain"
                  priority={true}
                />
              </div>
            )}
            <div className={s.heroHamburgTitles}>
              {' '}
              {heroSubTitle && (
                <h3 className={s.heroSubtitleHamburg}>
                  <span className={s.titleHamburg}>{heroSubTitle}</span>
                </h3>
              )}
              {heroTitle && (
                <h1 className={s.heroTitleHamburg}>
                  <span className={s.titleHamburg}>{heroTitle}</span>
                </h1>
              )}
            </div>
          </div>
          <div className={s.heroHamburgSecondary}>
            <div className={cN(s.heroHamburgHalf, s.heroHamburgLeft)}>
              <h3 className={s.titleInform}>
                <span className={s.titleHamburg}>Informieren</span>
              </h3>
              <p>
                <strong>
                  Kann das Grundeinkommen uns als Gesellschaft weiterbringen?
                </strong>
                <br />
                Testen wir es doch einfach! Per Volksentscheid wollen wir einen
                staatlich finanzierten Modellversuch möglich machen, um genau
                diese Frage zu beantworten.
              </p>
              <CTAButtonContainer>
                <CTALink to="/informieren" className={s.heroHamburgButton}>
                  Informieren
                </CTALink>
              </CTAButtonContainer>
            </div>
            <div className={cN(s.heroHamburgHalf, s.heroHamburgRight)}>
              <h3 className={s.titleParticipate}>
                <span className={s.titleHamburg}>Mitmachen</span>
              </h3>
              <p>
                <strong>Wir brauchen deine Unterstützung!</strong>
                <br />
                Um den Volksentscheid zu gewinnen, müssen mindestens 262.609
                Hamburger*innen dafür stimmen. <br />
                Sei dabei und hilf mit, dieses Ziel zu erreichen!
              </p>
              <CTAButtonContainer>
                <CTALink to="/mach-mit" className={s.heroHamburgButton}>
                  Mitmachen
                </CTALink>
              </CTAButtonContainer>
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
                layout="fill"
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
