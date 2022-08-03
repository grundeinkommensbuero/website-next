import cN from 'classnames';
import { ReactElement } from 'react';
import { ColorScheme, Status } from '.';
import { stringToId } from '../../utils/stringToId';
import { DirectusImage } from '../Util/DirectusImage';
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
}: SectionWrapperProps) => {
  const anchorId = anchor && stringToId(anchor);

  return (
    <>
      {hasHero && heroImage && (
        <div className={s.sectionHero}>
          <DirectusImage
            assetId={heroImage}
            alt={'Bild der Expedition Grundeinkommen'}
            layout="fill"
            objectFit="cover"
          />
          <div className={s.sectionHeroImageOverlay} />
          {heroTitle && <h2 className={s.sectionHeroTitle}>{heroTitle}</h2>}
        </div>
      )}

      <div
        className={`py-16 ${colorScheme} ${
          status === 'draft' ? s.draftSection : ''
        } relative`}
      >
        {status === 'draft' && <h3 className={s.draftLabel}>Entwurf</h3>}
        <section className="sections">
          {title && (
            <h2
              className={cN(
                'mb-4',
                'px-4',
                `${colorScheme === 'colorSchemeWhite' ? 'text-violet' : ''}`
              )}
            >
              {title}
            </h2>
          )}
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
