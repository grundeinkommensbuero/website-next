import Image from 'next/image';
import { ReactElement, useState } from 'react';
import parseHTML from 'html-react-parser';

import { getAssetURL } from '../../utils/getAssetURL';
import dynamic from 'next/dynamic';

import cN from 'classnames';
import { getEvenLayout, getOddLayout, getOverrideLayout } from './utlis';

import { Tiptap } from '../Editor/Tiptap';
import { EditSection } from './EditSection';
import { EditElement } from './EditElement';

type SectionProps = {
  section: Section;
};

export type Layout = '100' | '75-25' | '50-50' | '25-75';

export type OverrideLayout = '100' | '75' | '50' | '25' | null;

export type ColorScheme =
  | 'colorSchemeAqua'
  | 'colorSchemeViolet'
  | 'colorSchemeWhite'
  | 'colorSchemeRed';

export type Section = {
  id: string;
  title: string;
  sort: number | null;
  status: string;
  elements: number[];
  render: Element[];
  colorScheme: ColorScheme;
  layout: Layout;
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
  edit?: boolean;
};

export const Section = ({ section }: SectionProps): ReactElement => {
  const [modifiedSection, setModifiedSection] = useState<Section>(section);
  // (!) Will be replaced with actual login State
  const isLoggedIn = false;

  return (
    <>
      {isLoggedIn && (
        <EditSection
          modifiedSection={modifiedSection}
          setModifiedSection={setModifiedSection}
        />
      )}
      <SectionWrapper
        colorScheme={modifiedSection.colorScheme}
        title={modifiedSection.title}>
        <div className='flexWrap'>
          {modifiedSection.render.map((element, index) => {
            const flexItemClass =
              index % 2 == 0
                ? getEvenLayout(modifiedSection.layout)
                : getOddLayout(modifiedSection.layout);

            const overrideFlexItemClass = getOverrideLayout(
              element.overrideLayout || ''
            );

            switch (element.collection) {
              case 'sectionsText':
                return (
                  <div
                    key={'text' + element.id}
                    className={cN(
                      overrideFlexItemClass
                        ? overrideFlexItemClass
                        : flexItemClass
                    )}>
                    {isLoggedIn && (
                      <EditElement
                        modifiedSection={modifiedSection}
                        setModifiedSection={setModifiedSection}
                        element={element}
                        index={index}
                      />
                    )}
                    {!element.edit ? (
                      <>{parseHTML(element.content)}</>
                    ) : (
                      <Tiptap content={element.content} />
                    )}
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
                    {isLoggedIn && (
                      <EditElement
                        modifiedSection={modifiedSection}
                        setModifiedSection={setModifiedSection}
                        element={element}
                        index={index}
                      />
                    )}
                    <div>
                      <Image
                        src={getAssetURL(element.image)}
                        alt='Bild zum Blogpost'
                        height={600}
                        width={600}
                        className='object-cover h-full w-full'
                      />
                    </div>
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
    </>
  );
};

type SectionWrapperProps = {
  children: ReactElement;
  colorScheme: ColorScheme;
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
        <h2
          className={cN(
            'mb-4',
            'px-4',
            `${colorScheme === 'colorSchemeWhite' ? 'text-violet' : ''}`
          )}>
          {title}
        </h2>
        {children}
      </section>
    </section>
  );
};
