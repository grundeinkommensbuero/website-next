import { ReactElement, useState, useEffect, useContext } from 'react';
import { NoSsr } from '../Util/NoSsr';
import ReactTooltip from 'react-tooltip';
import * as _actions from './_actions';
import { hasKey } from '../../utils/hasKey';
import dynamic from 'next/dynamic';

import cN from 'classnames';
import {
  getLeftLayout,
  getRightLayout,
  getOverrideLayout,
} from './style.utlis';

import { EditSection } from './EditSection';
import { EditElement } from './EditElement';
import { DirectusImage } from '../Util/DirectusImage';
import { SectionWrapper } from './SectionWrapper';
import { SectionsTextEditable } from './SectionsTextEditable';
import { YoutubeEmbed } from '../Video/YoutubeEmbed';
import { XbgeAppContext } from '../../context/App';
import { CTAButton } from '../Forms/CTAButton';
import { useRouter } from 'next/router';
import { OnboardingModalContext } from '../../context/OnboardingModal';
import { FAQ } from '../FAQ';
import CollectionMap, { MapConfig } from '../CollectionMap';

export type Section = {
  id: string;
  title: string;
  label: string;
  sort: number | null;
  status: Status;
  layout: Layout;
  colorScheme: ColorScheme;
  includeAgs: string[];
  excludeAgs: string[];
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

export type SectionsImage = SectionElementBase & {
  collection: 'sectionsImage';
  image: string;
  alt: string;
};

export type SectionsComponent = SectionElementBase & {
  collection: 'sectionsComponent';
  component: string;
};

export type SectionsVideo = SectionElementBase & {
  collection: 'sectionsVideo';
  embedId: string;
};

export type SectionsCTAButton = SectionElementBase & {
  collection: 'sectionsCTAButton';
  buttonText: string;
  align: 'left' | 'center' | 'right';
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
  overrideLayout: string | null;
  index: number;
  groupElement: boolean;
};

export type Layout = '100' | '75-25' | '50-50' | '25-75';

export type OverrideLayout = '100' | '75' | '50' | '25' | null;

export type Align = 'left' | 'right' | 'center' | null;

export type ColorScheme =
  | 'colorSchemeAqua'
  | 'colorSchemeViolet'
  | 'colorSchemeWhite'
  | 'colorSchemeRed'
  | 'colorSchemeRose'
  | 'colorSchemeRoseOnWhite';

type GroupedElements = Array<Array<SectionElement>>;

type SectionProps = {
  section: Section;
};

export const Section = ({ section }: SectionProps): ReactElement => {
  const { pageBuilderActive } = useContext(XbgeAppContext);
  const { setShowModal } = useContext(OnboardingModalContext);
  const [modifiedSection, setModifiedSection] = useState<Section>(section);
  const [groupedElements, setGroupedElements] = useState<GroupedElements>([]);
  const router = useRouter();

  // Some actions might be imported from the _actions.ts file,
  // but others need react hooks, so we define them here and
  // combine both in one accessible object.
  // Note that naming of the following functions have to match
  // the action entries in directus.
  const actions = {
    openOnboardingFlow: () => setShowModal(true),
    ..._actions,
  };

  useEffect(() => {
    const elements: Array<Array<SectionElement>> = [];
    let groupId = 0;
    const increment = () => {
      groupId = groupId + 1;
    };

    modifiedSection.render.forEach((element, index) => {
      // We want to add the orig index to the element,
      // to target a specific update in a directus section.
      const addIndex = (element: SectionElement) => {
        return {
          ...element,
          index,
        };
      };

      if (element.overrideLayout || (!element.groupElement && index !== 0)) {
        increment();
      }

      if (!elements[groupId]) {
        elements[groupId] = [addIndex(element)];
      } else {
        elements[groupId].push(addIndex(element));
      }
    });
    setGroupedElements(elements);
  }, [modifiedSection]);

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
      >
        <div className="flexWrap">
          {groupedElements.map((elements, index) => {
            const flexItemClass =
              index % 2 == 0
                ? getLeftLayout(modifiedSection.layout)
                : getRightLayout(modifiedSection.layout);

            const overrideFlexItemClass =
              elements.length === 1 && elements[0].overrideLayout
                ? getOverrideLayout(elements[0].overrideLayout || '')
                : null;

            return (
              <div
                key={index}
                className={cN(
                  overrideFlexItemClass ? overrideFlexItemClass : flexItemClass
                )}
              >
                {elements.map(element => {
                  switch (element.collection) {
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
                          <DirectusImage
                            className=""
                            assetId={element.image}
                            alt={element.alt}
                          />
                        </div>
                      );
                    case 'sectionsComponent':
                      const Component = dynamic(
                        () => import(`../_dynamic/${element.component}`)
                        // { ssr: false, loading: () => null }
                      );
                      return (
                        <div key={'component-' + element.index}>
                          {pageBuilderActive && (
                            <EditElement
                              modifiedSection={modifiedSection}
                              setModifiedSection={setModifiedSection}
                              element={element}
                            />
                          )}
                          <Component key={element.id} />
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
                })}
              </div>
            );
          })}
        </div>
      </SectionWrapper>
    </>
  );
};
