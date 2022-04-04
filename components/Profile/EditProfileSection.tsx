import cN from 'classnames';
import { ReactElement } from 'react';
import s from './style.module.scss';

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
        'colorSchemeAqua',
        s.editPageSection,
        s.editSettings,
        className
      )}
    >
      {children}
    </section>
  );
};
