import { DirectusImage } from './../components/Section/index';
import { Directus, RelationItem } from '@directus/sdk';
import { Coordinates } from '../components/CollectionMap';
import {
  Section,
  ColorScheme,
  SectionsImage,
  SectionsComponent,
  SectionsText,
  SectionsVideo,
  SectionsCTAButton,
  SectionsFAQ,
  SectionsCollectionMap,
  Status,
} from '../components/Section';
import { PageProps } from '../pages/[id]';

export type Page = {
  slug: string;
  title: string;
  status: Status;
  hasHero: boolean;
  heroHTML: string | null;
  heroTitle: string | null;
  heroSubTitle: string | null;
  heroImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  sections: Section[];
};

type FetchedPage = {
  slug: string;
  title: string;
  status: Status;
  hasHero: boolean;
  heroHTML: string | null;
  heroTitle: string | null;
  heroSubTitle: string | null;
  heroImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  sections: FetchedSectionData[];
};

const pageFields = [
  'slug',
  'title',
  'status',
  'hasHero',
  'heroHTML',
  'heroTitle',
  'heroSubTitle',
  'heroImage',
  'metaTitle',
  'metaDescription',
  'ogImage',
];

type FetchedSectionData = {
  sort: number;
  item: {
    id: string;
    status: Status;
    sort: null | number;
    title: string;
    label: string;
    anchor?: string;
    colorScheme: ColorScheme;
    includeAgs?: string[];
    excludeAgs?: string[];
    hasHero: boolean;
    heroTitle?: string;
    heroImage?: string;
    elements: FetchedElement[];
  };
};

const sectionFields = [
  'id',
  'status',
  'sort',
  'title',
  'label',
  'anchor',
  'colorScheme',
  'hasHero',
  'heroTitle',
  'heroImage',
];

export type Align = 'left' | 'center' | 'right';

export type Column =
  | 'left'
  | 'right'
  | 'leftThird'
  | 'rightThird'
  | 'centerWide'
  | 'centerNarrow'
  | 'centerThird';

type FetchedElement = {
  collection:
    | 'sectionsText'
    | 'sectionsImage'
    | 'sectionsComponent'
    | 'sectionsVideo'
    | 'sectionsCTAButton'
    | 'sectionsFAQ'
    | 'sectionsCollectionMap';
  item: {
    id: string;
    status: Status;
    sort: number;
    image?: DirectusImage;
    alt?: string;
    content?: string;
    component?: string;
    embedId?: string;
    buttonText?: string;
    type?: string;
    action?: string;
    href?: string;
    slug?: string;
    column?: Column;
    align?: Align;
    title?: string;
    props?: string;
    questionAnswerPair?: Array<{
      questionAnswerPair_id: QuestionAnswerPair;
    }>;
    state?: string;
    maxBounds?: [Coordinates, Coordinates]; // json
    groupWithPrevious: boolean;
    alignTop?: boolean;
    imageLink?: string;
  };
};

const elementFields = [
  'id',
  'status',
  'sort',
  'overrideLayout',
  'groupElement',
  'image.id',
  'image.width',
  'image.height',
  'alt',
  'content',
  'component',
  'embedId',
  'buttonText',
  'type',
  'action',
  'href',
  'slug',
  'align',
  'column',
  'title',
  'state',
  'maxBounds',
  'props',
  'groupWithPrevious',
  'alignTop',
  'imageLink',
];

const faqFields = ['title', 'question', 'answer', 'openInitially'];

type Relation = 'MANY-TO-ALL' | 'MANY-TO-MANY' | 'ROOT';

const getFields = (
  basepath: string,
  relation: Relation,
  fields: Array<string>
): Array<string> => {
  switch (relation) {
    case 'ROOT':
      return fields.map(x => basepath + x);
    case 'MANY-TO-ALL':
      return fields.map(x => basepath + 'item.' + x);
    case 'MANY-TO-MANY': {
      const xs = basepath.split('.');
      return fields.map(x => `${basepath}${xs[xs.length - 2]}_id.${x}`);
    }
  }
};

const fields = [
  ...getFields('', 'ROOT', pageFields),
  ...getFields('sections.', 'MANY-TO-ALL', sectionFields),
  'sections.item.elements.collection',
  ...getFields('sections.item.elements.', 'MANY-TO-ALL', elementFields),

  ...getFields(
    'sections.item.elements.item.questionAnswerPair.',
    'MANY-TO-MANY',
    faqFields
  ),
];

export const getPageProps = async (
  slug: string,
  isPreview?: boolean
): Promise<PageProps> => {
  const directus = new Directus(process.env.DIRECTUS || '');

  try {
    // Get the current page from directus by slug (ID)
    const _page = (await directus.items('pages').readOne(slug, {
      fields,
    })) as FetchedPage;

    return {
      page: updatePageStructure(_page, isPreview),
    };
  } catch (err) {
    console.log(err);
    return {
      page: null,
    };
  }
};

const updatePageStructure = (
  fetchedPage: FetchedPage,
  isPreview?: boolean
): Page => {
  return {
    slug: fetchedPage.slug,
    title: fetchedPage.title,
    status: fetchedPage.status,
    hasHero: fetchedPage.hasHero,
    heroHTML: fetchedPage.heroHTML,
    heroTitle: fetchedPage.heroTitle,
    heroSubTitle: fetchedPage.heroSubTitle,
    heroImage: fetchedPage.heroImage,
    metaTitle: fetchedPage.metaTitle,
    metaDescription: fetchedPage.metaDescription,
    ogImage: fetchedPage.ogImage,
    sections: fetchedPage.sections
      .filter(
        s =>
          s.item.status === 'published' ||
          (isPreview && s.item.status === 'draft') ||
          process.env.NEXT_PUBLIC_DEVELOPMENT
      )
      .map(section => {
        return {
          id: section.item.id,
          title: section.item.title,
          label: section.item.label,
          sort: section.item.sort,
          status: section.item.status,
          colorScheme: section.item.colorScheme,
          anchor: section.item.anchor,
          includeAgs: section.item.includeAgs || [],
          excludeAgs: section.item.excludeAgs || [],
          hasHero: section.item.hasHero,
          heroTitle: section.item.heroTitle,
          heroImage: section.item.heroImage,
          render: section.item.elements
            .filter(
              e =>
                e.item.status === 'published' ||
                (isPreview && e.item.status === 'draft') ||
                process.env.NEXT_PUBLIC_DEVELOPMENT
            )
            .map((element, index) => {
              const baseElement = {
                id: element.item.id,
                status: element.item.status,
                sort: element.item.sort,
                column: element.item.column || 'centerWide',
                groupWithPrevious: element.item.groupWithPrevious,
                alignTop: !!element.item.alignTop,
                index,
              };
              switch (element.collection) {
                case 'sectionsText':
                  return {
                    ...baseElement,
                    collection: 'sectionsText',
                    content: element.item.content,
                  } as SectionsText;
                case 'sectionsImage':
                  return {
                    ...baseElement,
                    collection: 'sectionsImage',
                    image: element.item.image,
                    alt: element.item.alt,
                    imageLink: element.item.imageLink,
                  } as SectionsImage;
                case 'sectionsComponent':
                  return {
                    ...baseElement,
                    collection: 'sectionsComponent',
                    component: element.item.component,
                    props: element.item.props,
                  } as SectionsComponent;
                case 'sectionsVideo':
                  return {
                    ...baseElement,
                    collection: 'sectionsVideo',
                    embedId: element.item.embedId,
                  } as SectionsVideo;
                case 'sectionsCTAButton':
                  return {
                    ...baseElement,
                    collection: 'sectionsCTAButton',
                    buttonText: element.item.buttonText,
                    type: element.item.type,
                    action: element.item.action,
                    href: element.item.href,
                    slug: element.item.slug,
                    align: element.item.align,
                  } as SectionsCTAButton;
                case 'sectionsFAQ':
                  return {
                    ...baseElement,
                    collection: 'sectionsFAQ',
                    title: element.item.title,
                    questionAnswerPair: element.item.questionAnswerPair
                      ? element.item.questionAnswerPair.map(questionAnswer => {
                          return {
                            question:
                              questionAnswer.questionAnswerPair_id.question,
                            answer: questionAnswer.questionAnswerPair_id.answer,
                            openInitially:
                              questionAnswer.questionAnswerPair_id
                                .openInitially,
                          };
                        })
                      : [],
                  } as SectionsFAQ;
                case 'sectionsCollectionMap':
                  return {
                    ...baseElement,
                    collection: 'sectionsCollectionMap',
                    state: element.item.state,
                    maxBounds: element.item.maxBounds,
                  } as SectionsCollectionMap;
              }
            }),
        };
      }),
  };
};

export type QuestionAnswerPair = {
  question: string | null;
  answer: string | null;
  openInitially: boolean;
};

// TODO: not used?
const fetchManyToAllRelation = async (
  collection: string,
  ids: Array<number>,
  fields: Array<string>
): Promise<Array<{ [key: string]: string }>> => {
  const directus = new Directus(process.env.DIRECTUS || '');
  try {
    const m2a = (await directus.items(collection).readMany(ids, {
      fields,
    })) as [];
    console.log(m2a);
    return m2a;
  } catch (error) {
    console.log(error);
  }
  return [];
};
