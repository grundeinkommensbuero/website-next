import { Directus } from '@directus/sdk';
import { PageProps } from '../pages/[id]';
import {
  Section,
  Layout,
  ColorScheme,
  SectionsImage,
  SectionsComponent,
  SectionsText,
  SectionsVideo,
  SectionsCTAButton,
  SectionsFAQ,
  Status,
  Align,
  QuestionAnswerPair,
  CTAType,
} from '../components/Section';

// -----------------------------------------------------------------------------
// Target Page Type
// -----------------------------------------------------------------------------

export type Page = {
  slug: string;
  title: string;
  status: Status;
  hasHero: boolean;
  heroTitle: string | null;
  heroSubTitle: string | null;
  heroImage: string | null;
  sections: Array<Section>;
};

// -----------------------------------------------------------------------------
// Api Result Type - Page
// -----------------------------------------------------------------------------

type DirectusPage = {
  slug: string;
  title: string;
  status: Status;
  hasHero: boolean;
  heroTitle: string | null;
  heroSubTitle: string | null;
  heroImage: string | null;
  sections: Array<DirectusSection>;
};

const pageFields = [
  'slug',
  'title',
  'status',
  'hasHero',
  'heroTitle',
  'heroSubTitle',
  'heroImage',
];

// -----------------------------------------------------------------------------
// Api Result Type - Section
// -----------------------------------------------------------------------------

type DirectusSection = {
  sort: number;
  item: {
    id: string;
    status: Status;
    sort: null | number;
    title: string;
    label: string;
    layout: Layout;
    colorScheme: ColorScheme;
    includeAgs?: Array<string>;
    excludeAgs?: Array<string>;
    elements: Array<DirectusElement>;
  };
};

// Fields we want to fetch from Directus
const sectionFields = [
  'id',
  'status',
  'sort',
  'title',
  'label',
  'layout',
  'colorScheme',
];

// -----------------------------------------------------------------------------
// Api Result Types - Section Elements
// -----------------------------------------------------------------------------

// Combine all sub-types to a larger union type
type DirectusElement =
  | DirectusSectionsText
  | DirectusSectionsImage
  | DirectusSectionsComponent
  | DirectusSectionsVideo
  | DirectusSectionsCTAButton
  | DirectusSectionsFAQ;

// Type and fields that all elements have in common
type DirectusElementBase = {
  overrideLayout: string | null;
  groupElement: boolean;
  id: string;
  status: Status;
  sort: number | null;
};

const elementBaseFields = [
  'id',
  'status',
  'sort',
  'overrideLayout',
  'groupElement',
];

// -----------------------------------------------------------------------------
// Api Result Type - SectionsText
// -----------------------------------------------------------------------------

type DirectusSectionsText = {
  collection: 'sectionsText';
  item: DirectusElementBase & {
    content: string;
  }; // basetype extended with custom fields
};

const sectionsTextFields = ['content'];

// -----------------------------------------------------------------------------
// Api Result Type - SectionsImage
// -----------------------------------------------------------------------------

type DirectusSectionsImage = {
  collection: 'sectionsImage';
  item: DirectusElementBase & {
    image: string;
    alt: string;
  };
};

const sectionsImageFields = ['image', 'alt'];

// -----------------------------------------------------------------------------
// Api Result Type - SectionsComponent
// -----------------------------------------------------------------------------

type DirectusSectionsComponent = {
  collection: 'sectionsComponent';
  item: DirectusElementBase & {
    component: string;
  };
};

const sectionsComponentFields = ['component'];

// -----------------------------------------------------------------------------
// Api Result Type - SectionsVideo
// -----------------------------------------------------------------------------

type DirectusSectionsVideo = {
  collection: 'sectionsVideo';
  item: DirectusElementBase & {
    embedId: string;
  };
};

const sectionsVideoFields = ['embedId'];

// -----------------------------------------------------------------------------
// Api Result Type - SectionsCTAButton
// -----------------------------------------------------------------------------

type DirectusSectionsCTAButton = {
  collection: 'sectionsCTAButton';
  item: DirectusElementBase & {
    buttonText: string;
    align: Align;
    type: CTAType;
    action: string | null;
    href: string | null;
    slug: string | null;
  };
};

const sectionsCTAButtonFields = [
  'buttonText',
  'align',
  'type',
  'action',
  'href',
  'slug',
];

// -----------------------------------------------------------------------------
// Api Result Type - SectionsFAQ
// -----------------------------------------------------------------------------

type DirectusSectionsFAQ = {
  collection: 'sectionsFAQ';
  item: DirectusElementBase & {
    title?: string;
    questionAnswerPair?: Array<{
      questionAnswerPair_id: QuestionAnswerPair;
    }>;
  };
};

const sectionsFAQFields = ['title'];

const questionAnswerPairFields = ['question', 'answer', 'openInitially'];

const elementFields = [
  ...elementBaseFields,
  ...sectionsTextFields,
  ...sectionsImageFields,
  ...sectionsComponentFields,
  ...sectionsVideoFields,
  ...sectionsCTAButtonFields,
  ...sectionsFAQFields,
];

const faqFields = ['title', 'question', 'answer', 'openInitially'];

type Relation = 'MANY-TO-ALL' | 'MANY-TO-MANY' | 'ROOT';

// -----------------------------------------------------------------------------
// Request Utils
// -----------------------------------------------------------------------------

interface CollectionDescriptor {
  relation: Relation;
  rootFields?: Array<string>;
  relationFields?: Array<string>;
  nestedFields?: { [key: string]: CollectionDescriptor };
}

const requestPage: CollectionDescriptor = {
  relation: 'ROOT',
  rootFields: pageFields,
  nestedFields: {
    sections: {
      relation: 'MANY-TO-ALL',
      relationFields: sectionFields,
      nestedFields: {
        elements: {
          relation: 'MANY-TO-ALL',
          rootFields: ['collection'],
          relationFields: elementFields,
          nestedFields: {
            questionAnswerPair: {
              relation: 'MANY-TO-MANY',
              relationFields: faqFields,
            },
          },
        },
      },
    },
  },
};

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

export const getPageProps = async (slug: string): Promise<PageProps> => {
  const directus = new Directus(process.env.DIRECTUS || '');

  try {
    // Get the current page from directus by slug (ID)
    const _page = (await directus.items('pages').readOne(slug, {
      fields,
    })) as DirectusPage;

    return {
      page: updatePageStructure(_page),
    };
  } catch (err) {
    console.log(err);
    return {
      page: null,
    };
  }
};

const updatePageStructure = (fetchedPage: DirectusPage): Page => {
  return {
    slug: fetchedPage.slug,
    title: fetchedPage.title,
    status: fetchedPage.status,
    hasHero: fetchedPage.hasHero,
    heroTitle: fetchedPage.heroTitle,
    heroSubTitle: fetchedPage.heroSubTitle,
    heroImage: fetchedPage.heroImage,
    sections: fetchedPage.sections
      .filter(
        s =>
          s.item.status === 'published' || process.env.NEXT_PUBLIC_DEVELOPMENT
      )
      .map(section => {
        return {
          id: section.item.id,
          title: section.item.title,
          label: section.item.label,
          sort: section.item.sort,
          status: section.item.status,
          layout: section.item.layout,
          colorScheme: section.item.colorScheme,
          includeAgs: section.item.includeAgs || [],
          excludeAgs: section.item.excludeAgs || [],
          render: section.item.elements
            .filter(
              e =>
                e.item.status === 'published' ||
                process.env.NEXT_PUBLIC_DEVELOPMENT
            )
            .map((element, index) => {
              const baseElement = {
                id: element.item.id,
                status: element.item.status,
                sort: element.item.sort,
                overrideLayout: element.item.overrideLayout,
                groupElement: element.item.groupElement,
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
                  } as SectionsImage;
                case 'sectionsComponent':
                  return {
                    ...baseElement,
                    collection: 'sectionsComponent',
                    component: element.item.component,
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
              }
            }),
        };
      }),
  };
};

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
