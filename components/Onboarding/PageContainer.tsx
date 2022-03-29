import { ReactElement } from 'react';
import s from './style.module.scss';
import cN from 'classnames';

type PageContainerProps = {
  children: ReactElement | ReactElement[];
};

export const PageContainer = ({
  children,
}: PageContainerProps): ReactElement => {
  return (
    <section className={cN(s.pageContainer, 'colorSchemeWhite')}>
      {children}
    </section>
  );
};
