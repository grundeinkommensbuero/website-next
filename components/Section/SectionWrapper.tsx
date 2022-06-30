import cN from 'classnames';
import { ReactElement } from 'react';
import { ColorScheme, Status } from '.';
import s from './style.module.scss';

type SectionWrapperProps = {
  children: ReactElement;
  colorScheme: ColorScheme;
  title?: string;
  status?: Status;
};

export const SectionWrapper = ({
  children,
  colorScheme,
  title,
  status,
}: SectionWrapperProps) => {
  return (
    <section
      className={`py-16 ${colorScheme} ${
        status === 'draft' ? s.draftSection : ''
      }`}
    >
      {status === 'draft' && <h3 className={s.draftLabel}>Entwurf</h3>}
      {/* TODO: maybe don't nest two sections? */}
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
    </section>
  );
};
