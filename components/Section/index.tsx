import { ReactElement, useState } from 'react';
import parseHTML from 'html-react-parser';

import dynamic from 'next/dynamic';

import cN from 'classnames';
import { getEvenLayout, getOddLayout, getOverrideLayout } from './style.utlis';

import { Tiptap } from '../Editor/Tiptap';
import { EditSection } from './EditSection';
import { EditElement } from './EditElement';
import { DirectusImage } from '../Utils/DirectusImage';
import { SectionWrapper } from './SectionWrapper';

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

type SectionProps = {
  section: Section;
};

export const Section = ({ section }: SectionProps): ReactElement => {
  const [modifiedSection, setModifiedSection] = useState<Section>(section);
  // (!) Will be replaced with actual login State
  const isLoggedIn = process.env.NEXT_PUBLIC_FAKEROOT === 'true' ? true : false;

  // Should be moved to a "EditText" component
  const updateContent = (index: number, content: string): void => {
    // Get and update the edited element
    const updatedElement: Element = {
      ...modifiedSection.render[index],
      content,
    };
    // Replace it in render list
    const updatedRender = modifiedSection.render.map((element, elIndex) => {
      if (elIndex === index) {
        return updatedElement;
      }
      return element;
    });
    // Update renderlist in section
    const updated = {
      ...modifiedSection,
      render: updatedRender,
    };
    setModifiedSection(updated);
  };

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
        title={modifiedSection.title}
      >
        <div className="flexWrap">
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
                    )}
                  >
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
                      <Tiptap
                        content={element.content}
                        updateContent={content => updateContent(index, content)}
                      />
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
                    )}
                  >
                    {isLoggedIn && (
                      <EditElement
                        modifiedSection={modifiedSection}
                        setModifiedSection={setModifiedSection}
                        element={element}
                        index={index}
                      />
                    )}
                    <DirectusImage
                      className="object-cover h-full w-full"
                      assetId={element.image}
                      alt={element.title}
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
                    )}
                  >
                    {isLoggedIn && (
                      <EditElement
                        modifiedSection={modifiedSection}
                        setModifiedSection={setModifiedSection}
                        element={element}
                        index={index}
                      />
                    )}
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
