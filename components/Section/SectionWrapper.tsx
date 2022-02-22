type SectionWrapperProps = {
  children: ReactElement;
  colorScheme: ColorScheme;
  title: string;
};
import cN from 'classnames';
import { ReactElement } from 'react';
import { ColorScheme } from '.';

export const SectionWrapper = ({
  children,
  colorScheme,
  title,
}: SectionWrapperProps) => {
  return (
    <section className={`py-16 ${colorScheme}`}>
      <section className="sections">
        <h2
          className={cN(
            'mb-4',
            'px-4',
            `${colorScheme === 'colorSchemeWhite' ? 'text-violet' : ''}`
          )}
        >
          {title}
        </h2>
        {children}
      </section>
    </section>
  );
};
