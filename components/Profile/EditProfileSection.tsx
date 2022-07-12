import cN from 'classnames';
import { ReactElement } from 'react';
import s from './style.module.scss';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

type EditProfileSectionProps = {
  children: ReactElement | ReactElement[] | string;
  className?: string;
};

export const EditProfileSection = ({
  children,
  className,
}: EditProfileSectionProps): ReactElement => {
  return (
    <section
      className={cN(
        IS_BERLIN_PROJECT ? 'colorSchemeRose' : 'colorSchemeAqua',
        s.editPageSection,
        s.editSettings,
        className
      )}
    >
      {children}
    </section>
  );
};
