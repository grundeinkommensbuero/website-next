import Image from 'next/image';
import { ReactElement } from 'react';
import parseHTML from 'html-react-parser';

import { getAssetURL } from '../../utils/getAssetURL';
import dynamic from 'next/dynamic';

import cN from 'classnames';
// import s from './style.module.scss';
import { getEvenLayout, getOddLayout, getOverrideLayout } from './utlis';

type SectionProps = {
  section: Section;
};

export type Section = {
  id: string;
  title: string;
  sort: number | null;
  status: string;
  elements: number[];
  render: Element[];
  colorScheme: string;
  layout: string;
};

export type Element = {
  id: string;
  title: string;
  content: string;
  image: string;
  component: string;
  collection: string;
  sort: number | null;
  overrideLayout: string | null;
  align: string;
};

export const Section = ({ section }: SectionProps): ReactElement => {
  return (
    <SectionWrapper colorScheme={section.colorScheme} title={section.title}>
      <div className='flexWrap'>
        {section.render.map((element, index) => {
          const flexItemClass =
            index % 2 == 0
              ? getEvenLayout(section.layout)
              : getOddLayout(section.layout);
          const overrideFlexItemClass = getOverrideLayout(
            element.overrideLayout || ''
          );
          switch (element.collection) {
            case 'sectionsText':
              return (
                <div
                  className={cN(
                    overrideFlexItemClass
                      ? overrideFlexItemClass
                      : flexItemClass
                  )}
                  key={'text' + element.id}>
                  {parseHTML(element.content)}
                </div>
              );
            case 'sectionsImage':
              return (
                <div
                  key={'image' + element.id}
                  className={cN(
                    overrideFlexItemClass
                      ? overrideFlexItemClass
                      : flexItemClass
                  )}>
                  <Image
                    src={getAssetURL(element.image)}
                    alt='Bild zum Blogpost'
                    height={600}
                    width={600}
                    className='object-cover h-full w-full'
                  />
                </div>
              );
            case 'sectionsComponent':
              const Component = dynamic(
                () => import(`../_dynamic/${element.component}`),
                { ssr: false, loading: () => null }
              );
              return (
                <div
                  key={'component' + element.id}
                  className={cN(
                    overrideFlexItemClass
                      ? overrideFlexItemClass
                      : flexItemClass
                  )}>
                  <Component key={element.id} />
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </SectionWrapper>
  );
};

type SectionWrapperProps = {
  children: ReactElement;
  colorScheme: string;
  title: string;
};

const SectionWrapper = ({
  children,
  colorScheme,
  title,
}: SectionWrapperProps) => {
  return (
    <section className={`py-16 ${colorScheme}`}>
      <section className='sections'>
        <h2 className='mb-4 px-4'>{title}</h2>
        {children}
      </section>
    </section>
  );
};
