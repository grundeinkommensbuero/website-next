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
import { CTAButton } from '../Forms/CTAButton';
import { useRouter } from 'next/router';
import { FAQ } from '../FAQ';
import CollectionMap, { MapConfig } from '../CollectionMap';
import { useActions } from '../../hooks/DirectusAction/useActions';
import { Align, Column } from '../../utils/getPageProps';
import s from './style.module.scss';
import Image from 'next/image';
import { getAssetURL } from '../Util/getAssetURL';

export type Section = {
  id: string;
  title: string;
  label: string;
  sort: number | null;
  status: Status;
  colorScheme: ColorScheme;
  includeAgs: string[];
  excludeAgs: string[];
  hasHero: boolean;
  heroTitle?: string;
  heroImage?: DirectusImage;
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
      >
        <>
          <div className={s.elementContainer}>
            {modifiedSection.render.map((element, index) => {
              const { column, collection } = element;

              const renderElement = () => {
                switch (collection) {
                  case 'sectionsText':
                    return (
                      <SectionsTextEditable
                        key={'text-' + element.index}
                        element={element}
                        modifiedSection={modifiedSection}
                        pageBuilderActive={pageBuilderActive}
                        updateContent={updateContent}
                        setModifiedSection={setModifiedSection}
                      />
                    );
                  case 'sectionsImage':
                    return (
                      <div key={'image-' + element.index}>
                        {pageBuilderActive && (
                          <EditElement
                            modifiedSection={modifiedSection}
                            setModifiedSection={setModifiedSection}
                            element={element}
                          />
                        )}
                        <Image
                          src={getAssetURL(element.image.id)}
                          width={element.image.width}
                          height={element.image.height}
                          alt={element.alt}
                        />
                      </div>
                    );
                  case 'sectionsComponent':
                    const Component = dynamic(
                      () => import(`../_dynamic/${element.component}`),
                      { ssr: false, loading: () => null }
                    );
                    const props = element.props || {};

                    return (
                      <div key={'component-' + element.index}>
                        {pageBuilderActive && (
                          <EditElement
                            modifiedSection={modifiedSection}
                            setModifiedSection={setModifiedSection}
                            element={element}
                          />
                        )}
                        <Component key={element.id} {...props} />
                      </div>
                    );
                  case 'sectionsVideo':
                    return (
                      <div key={'video-' + element.index}>
                        {pageBuilderActive && (
                          <EditElement
                            modifiedSection={modifiedSection}
                            setModifiedSection={setModifiedSection}
                            element={element}
                          />
                        )}
                        <YoutubeEmbed embedId={element.embedId} />
                      </div>
                    );
                  case 'sectionsCTAButton':
                    const getAlignment = () => {
                      switch (element.align) {
                        case 'left':
                          return 'justify-start';
                        case 'center':
                          return 'justify-center';
                        case 'right':
                          return 'justify-end';
                      }
                    };
                    return (
                      <div key={'button-' + element.index}>
                        {pageBuilderActive && (
                          <EditElement
                            modifiedSection={modifiedSection}
                            setModifiedSection={setModifiedSection}
                            element={element}
                          />
                        )}
                        <div className={getAlignment()}>
                          {element.type === 'action' && (
                            <CTAButton
                              onClick={() => {
                                if (
                                  element.action &&
                                  hasKey(actions, element.action)
                                ) {
                                  actions[element.action]();
                                }
                              }}
                            >
                              {element.buttonText}
                            </CTAButton>
                          )}
                          {element.type === 'href' && (
                            <CTAButton
                              onClick={() =>
                                window.open(element.href || '', '_blank')
                              }
                            >
                              {element.buttonText}
                            </CTAButton>
                          )}
                          {element.type === 'slug' && (
                            <CTAButton
                              onClick={() => router.push(element.slug || '')}
                            >
                              {element.buttonText}
                            </CTAButton>
                          )}
                        </div>
                      </div>
                    );
                  case 'sectionsFAQ':
                    return (
                      <div key={'component-' + element.index}>
                        {pageBuilderActive && (
                          <EditElement
                            modifiedSection={modifiedSection}
                            setModifiedSection={setModifiedSection}
                            element={element}
                          />
                        )}
                        {element.title && <h2>{element.title}</h2>}
                        {element.questionAnswerPair.map(questionAnswer => {
                          return (
                            <FAQ
                              key={element.id}
                              question={questionAnswer.question}
                              answer={questionAnswer.answer}
                              openInitially={questionAnswer.openInitially}
                            />
                          );
                        })}
                      </div>
                    );
                  case 'sectionsCollectionMap':
                    return (
                      <div key={'map-' + element.index}>
                        {pageBuilderActive && (
                          <EditElement
                            modifiedSection={modifiedSection}
                            setModifiedSection={setModifiedSection}
                            element={element}
                          />
                        )}
                        <CollectionMap
                          mapConfig={{
                            state: element.state,
                            maxBounds: element.maxBounds,
                          }}
                        />
                      </div>
                    );
                  default:
                    return null;
                }
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
                  {renderElement()}
                </div>
              );
            })}
          </div>
        </>
      </SectionWrapper>
    </>
  );
};
