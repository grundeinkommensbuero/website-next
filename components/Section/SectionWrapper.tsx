import cN from 'classnames';
import Image from 'next/image';
import { ReactElement } from 'react';
import { ColorScheme, Status } from '.';
import { getAssetURL } from '../Util/getAssetURL';
import { stringToId } from '../../utils/stringToId';
import s from './style.module.scss';

type SectionWrapperProps = {
  children: ReactElement;
  colorScheme: ColorScheme;
  title?: string;
  status?: Status;
  hasHero?: boolean;
  heroTitle?: string;
  heroImage?: string;
  anchor?: string;
  isFirstSection?: boolean;
};

export const SectionWrapper = ({
  children,
  colorScheme,
  title,
  status,
  hasHero,
  heroTitle,
  heroImage,
  anchor,
  isFirstSection = false,
}: SectionWrapperProps) => {
  const anchorId = anchor && stringToId(anchor);

  const headlineClasses = cN(
    'mb-4',
    `${colorScheme === 'colorSchemeWhite' ? 'text-violet' : ''}`
  );

  return (
    <>
      {hasHero && heroImage && (
        <div className={s.sectionHero}>
          <Image
            src={getAssetURL(heroImage)}
            alt={'Bild der Expedition Grundeinkommen'}
            layout="fill"
            objectFit="cover"
          />
          <div className={s.sectionHeroImageOverlay} />
          {heroTitle && <h2 className={s.sectionHeroTitle}>{heroTitle}</h2>}
        </div>
      )}

      <div
        className={`${hasHero ? s.hasHero : ''} ${
          s.sectionWrapper
        } ${colorScheme} ${status === 'draft' ? s.draftSection : ''} relative`}
      >
        {status === 'draft' && <h3 className={s.draftLabel}>Entwurf</h3>}
        <section className="sections">
          {title &&
            (isFirstSection ? (
              <h1 className={headlineClasses}>{title}</h1>
            ) : (
              <h2 className={headlineClasses}>{title}</h2>
            ))}
          {children}
        </section>

        {anchorId && (
          <div id={anchorId} className={s.jumpToAnchor}>
            <div id={anchorId.toLowerCase()} />
          </div>
        )}
      </div>
    </>
  );
};
