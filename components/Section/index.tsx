import { ReactElement, useState, useEffect, useContext } from 'react';
import { NoSsr } from '../Util/NoSsr';
import ReactTooltip from 'react-tooltip';
import { hasKey } from '../../utils/hasKey';
import dynamic from 'next/dynamic';

import cN from 'classnames';

import { EditSection } from './EditSection';
import { EditElement } from './EditElement';
import { SectionWrapper } from './SectionWrapper';
import { SectionsTextEditable } from './SectionsTextEditable';
import { YoutubeEmbed } from '../Video/YoutubeEmbed';
import { XbgeAppContext } from '../../context/App';
import { CTAButton, CTALink, CTALinkExternal } from '../Forms/CTAButton';
import { useRouter } from 'next/router';
import { FAQ } from '../FAQ';
import CollectionMap, { MapConfig } from '../CollectionMap';
import { useActions } from '../../hooks/DirectusAction/useActions';
import { Align, Column } from '../../utils/getPageProps';
import s from './style.module.scss';
import Image from 'next/image';
import { getAssetURL } from '../Util/getAssetURL';
import { LoadingAnimation } from '../LoadingAnimation';

export type Section = {
  id: string;
  title: string;
  label: string;
  sort: number | null;
  status: Status;
  colorScheme: ColorScheme;
  anchor?: string;
  includeAgs: string[];
  excludeAgs: string[];
  hasHero: boolean;
  heroTitle?: string;
  heroImage?: string;
  render: SectionElement[];
};

export type Status = 'published' | 'draft' | 'archived';

export type SectionElement =
  | SectionsText
  | SectionsImage
  | SectionsComponent
  | SectionsVideo
  | SectionsCTAButton
  | SectionsFAQ
  | SectionsCollectionMap;

export type SectionsText = SectionElementBase & {
  collection: 'sectionsText';
  content: string;
  edit?: boolean;
};

export type DirectusImage = {
  id: string;
  width: number;
  height: number;
};

export type SectionsImage = SectionElementBase & {
  collection: 'sectionsImage';
  image: DirectusImage;
  alt: string;
};

export type SectionsComponent = SectionElementBase & {
  collection: 'sectionsComponent';
  component: string;
  props?: { [key: string]: any };
};

export type SectionsVideo = SectionElementBase & {
  collection: 'sectionsVideo';
  embedId: string;
};

export type SectionsCTAButton = SectionElementBase & {
  collection: 'sectionsCTAButton';
  buttonText: string;
  align: Align;
  type: 'action' | 'href' | 'slug';
  action: string | null;
  href: string | null;
  slug: string | null;
};

export type SectionsFAQ = SectionElementBase & {
  collection: 'sectionsFAQ';
  title?: string;
  questionAnswerPair: Array<{
    question: string | null;
    answer: string | null;
    openInitially: boolean;
  }>;
};

export type SectionsCollectionMap = SectionElementBase &
  MapConfig & {
    collection: 'sectionsCollectionMap';
  };

export type SectionElementBase = {
  id: string;
  sort: number | null;
  index: number;
  column: Column;
  groupWithPrevious: boolean;
};

export type ColorScheme =
  | 'colorSchemeAqua'
  | 'colorSchemeViolet'
  | 'colorSchemeWhite'
  | 'colorSchemeRed'
  | 'colorSchemeRose'
  | 'colorSchemeRoseOnWhite';

type SectionProps = {
  section: Section;
};

export const Section = ({ section }: SectionProps): ReactElement => {
  const { pageBuilderActive } = useContext(XbgeAppContext);
  const [modifiedSection, setModifiedSection] = useState<Section>(section);
  const router = useRouter();
  const [actions] = useActions();

  // Should be moved to a "EditText" component
  const updateContent = (index: number, content: string): void => {
    const origElement = modifiedSection.render[index] as SectionsText;
    // Get and update the edited element
    const updatedElement: SectionsText = {
      ...origElement,
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

  let elementsToSkip: number[] = [];

  return (
    <>
      <NoSsr>
        <ReactTooltip backgroundColor={'black'} />
      </NoSsr>
      {pageBuilderActive && (
        <EditSection
          modifiedSection={modifiedSection}
          setModifiedSection={setModifiedSection}
          currentColorScheme={modifiedSection.colorScheme}
        />
      )}
      <SectionWrapper
        colorScheme={modifiedSection.colorScheme}
        title={modifiedSection.title}
        status={modifiedSection.status}
        hasHero={modifiedSection.hasHero}
        heroImage={modifiedSection.heroImage}
        heroTitle={modifiedSection.heroTitle}
        anchor={modifiedSection.anchor}
      >
        <>
          <div className={s.elementContainer}>
            {modifiedSection.render.map((element, index) => {
              const { column } = element;

              if (elementsToSkip.includes(index)) {
                return null;
              }

              const renderElement = (
                elementToRender: SectionElement,
                index: number
              ): ReactElement | null => {
                const { collection } = elementToRender;

                // If next element should be grouped we want to render both
                // in same grid cell
                const nextElement = modifiedSection.render[index + 1];
                const groupElements =
                  nextElement?.groupWithPrevious &&
                  nextElement.column === column;

                // Because we render the next element recursively inside this cell,
                // we want to skip it during the next iteration
                if (groupElements) {
                  elementsToSkip.push(index + 1);
                }

                let element;

                switch (collection) {
                  case 'sectionsText':
                    element = (
                      <>
                        <SectionsTextEditable
                          key={'text-' + elementToRender.index}
                          element={elementToRender}
                          modifiedSection={modifiedSection}
                          pageBuilderActive={pageBuilderActive}
                          updateContent={updateContent}
                          setModifiedSection={setModifiedSection}
                        />
                      </>
                    );
                    break;
                  case 'sectionsImage':
                    element = (
                      <div key={'image-' + elementToRender.index}>
                        {pageBuilderActive && (
                          <EditElement
                            modifiedSection={modifiedSection}
                            setModifiedSection={setModifiedSection}
                            element={elementToRender}
                          />
                        )}
                        <Image
                          src={getAssetURL(elementToRender.image.id)}
                          // We need to set a default width if an svg is used
                          width={elementToRender.image.width || 500}
                          height={elementToRender.image.height || 500}
                          alt={elementToRender.alt}
                        />
                      </div>
                    );
                    break;
                  case 'sectionsComponent':
                    const Component = dynamic(
                      () => import(`../_dynamic/${elementToRender.component}`),
                      { ssr: false, loading: () => <LoadingAnimation /> }
                    );
                    const props = elementToRender.props || {};

                    element = (
                      <div key={'component-' + elementToRender.index}>
                        {pageBuilderActive && (
                          <EditElement
                            modifiedSection={modifiedSection}
                            setModifiedSection={setModifiedSection}
                            element={elementToRender}
                          />
                        )}
                        <Component key={elementToRender.id} {...props} />
                      </div>
                    );
                    break;
                  case 'sectionsVideo':
                    element = (
                      <div key={'video-' + elementToRender.index}>
                        {pageBuilderActive && (
                          <EditElement
                            modifiedSection={modifiedSection}
                            setModifiedSection={setModifiedSection}
                            element={elementToRender}
                          />
                        )}
                        <YoutubeEmbed embedId={elementToRender.embedId} />
                      </div>
                    );
                    break;
                  case 'sectionsCTAButton':
                    const getAlignment = () => {
                      switch (elementToRender.align) {
                        case 'left':
                          return 'justify-start';
                        case 'center':
                          return 'justify-center';
                        case 'right':
                          return 'justify-end';
                      }
                    };
                    element = (
                      <>
                        <div key={'button-' + elementToRender.index}>
                          {pageBuilderActive && (
                            <EditElement
                              modifiedSection={modifiedSection}
                              setModifiedSection={setModifiedSection}
                              element={elementToRender}
                            />
                          )}
                          <div className={getAlignment()}>
                            {elementToRender.type === 'action' && (
                              <CTAButton
                                onClick={() => {
                                  if (
                                    elementToRender.action &&
                                    hasKey(actions, elementToRender.action)
                                  ) {
                                    actions[elementToRender.action]();
                                  }
                                }}
                              >
                                {elementToRender.buttonText}
                              </CTAButton>
                            )}
                            {elementToRender.type === 'href' && (
                              <CTALinkExternal
                                href={elementToRender.href || ''}
                              >
                                {elementToRender.buttonText}
                              </CTALinkExternal>
                            )}
                            {elementToRender.type === 'slug' && (
                              <CTALink to={elementToRender.slug || ''}>
                                {elementToRender.buttonText}
                              </CTALink>
                            )}
                          </div>
                        </div>
                      </>
                    );
                    break;

                  case 'sectionsFAQ':
                    element = (
                      <div key={'component-' + elementToRender.index}>
                        {pageBuilderActive && (
                          <EditElement
                            modifiedSection={modifiedSection}
                            setModifiedSection={setModifiedSection}
                            element={elementToRender}
                          />
                        )}
                        {elementToRender.title && (
                          <h2>{elementToRender.title}</h2>
                        )}
                        {elementToRender.questionAnswerPair.map(
                          questionAnswer => {
                            return (
                              <FAQ
                                key={elementToRender.id}
                                question={questionAnswer.question}
                                answer={questionAnswer.answer}
                                openInitially={questionAnswer.openInitially}
                              />
                            );
                          }
                        )}
                      </div>
                    );
                    break;
                  case 'sectionsCollectionMap':
                    element = (
                      <div key={'map-' + elementToRender.index}>
                        {pageBuilderActive && (
                          <EditElement
                            modifiedSection={modifiedSection}
                            setModifiedSection={setModifiedSection}
                            element={elementToRender}
                          />
                        )}
                        <CollectionMap
                          mapConfig={{
                            state: elementToRender.state,
                            maxBounds: elementToRender.maxBounds,
                          }}
                        />
                      </div>
                    );
                    break;
                  default:
                    return null;
                }

                return (
                  <>
                    {element}
                    {groupElements && (
                      <div className={s.groupedElement}>
                        {renderElement(nextElement, index + 1)}
                      </div>
                    )}
                  </>
                );
              };

              return (
                <div
                  key={index}
                  className={cN(s.element, {
                    [s.elementLeft]: column === 'left',
                    [s.elementRight]: column === 'right',
                    [s.elementLeftThird]: column === 'leftThird',
                    [s.elementCenterThird]: column === 'centerThird',
                    [s.elementRightThird]: column === 'rightThird',
                    [s.elementCenterWide]: column === 'centerWide',
                    [s.elementCenterNarrow]: column === 'centerNarrow',
                  })}
                >
                  {renderElement(element, index)}
                </div>
              );
            })}
          </div>
        </>
      </SectionWrapper>
    </>
  );
};
