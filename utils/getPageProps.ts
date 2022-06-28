import { Directus, RelationItem } from '@directus/sdk';
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
} from '../components/Section';
import { PageProps } from '../pages/[id]';

export type Page = {
  slug: string;
  title: string;
  status: Status;
  hasHero: boolean;
  heroTitle: string | null;
  heroSubTitle: string | null;
  heroImage: string | null;
  sections: Section[];
};

type FetchedPage = {
  slug: string;
  title: string;
  status: Status;
  hasHero: boolean;
  heroTitle: string | null;
  heroSubTitle: string | null;
  heroImage: string | null;
  sections: FetchedSectionData[];
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

type FetchedSectionData = {
  sort: number;
  item: {
    id: string;
    status: Status;
    sort: null | number;
    title: string;
    label: string;
    layout: Layout;
    colorScheme: ColorScheme;
    includeAgs?: string[];
    excludeAgs?: string[];
    elements: FetchedElement[];
  };
};

const sectionFields = [
  'id',
  'status',
  'sort',
  'title',
  'label',
  'layout',
  'colorScheme',
];

type Align = 'left' | 'center' | 'right';

type FetchedElement = {
  collection:
    | 'sectionsText'
    | 'sectionsImage'
    | 'sectionsComponent'
    | 'sectionsVideo'
    | 'sectionsCTAButton'
    | 'sectionsFAQ';
  item: {
    id: string;
    status: Status;
    sort: number;
    overrideLayout: string | null;
    groupElement: boolean;
    image?: string;
    alt?: string;
    content?: string;
    component?: string;
    embedId?: string;
    buttonText?: string;
    type?: string;
    action?: string;
    href?: string;
    slug?: string;
    align?: Align;
    title?: string;
    questionAnswerPair?: Array<{
      questionAnswerPair_id: QuestionAnswerPair;
    }>;
  };
};

const elementFields = [
  'id',
  'status',
  'sort',
  'overrideLayout',
  'groupElement',
  'image',
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
  'title',
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

export const getPageProps = async (slug: string): Promise<PageProps> => {
  const directus = new Directus(process.env.DIRECTUS || '');

  try {
    // Get the current page from directus by slug (ID)
    const _page = (await directus.items('pages').readOne(slug, {
      fields,
    })) as FetchedPage;

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

const updatePageStructure = (fetchedPage: FetchedPage): Page => {
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

export type QuestionAnswerPair = {
  question: string | null;
  answer: string | null;
  openInitially: boolean;
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
