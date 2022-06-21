import { Directus } from '@directus/sdk';
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
      questionAnswerPair_id: {
        question: string | null;
        answer: string | null;
        openInitially: boolean;
      };
    }>;
  };
};

export const getPageProps = async (slug: string): Promise<PageProps> => {
  const directus = new Directus(process.env.DIRECTUS || '');

  try {
    // Get the current page from directus by slug (ID)
    const _page = (await directus.items('pages').readOne(slug, {
      fields: [
        'slug',
        'title',
        'status',
        'hasHero',
        'heroTitle',
        'heroSubTitle',
        'heroImage',
        'sections.sort',
        'sections.item.id',
        'sections.item.status',
        'sections.item.sort',
        'sections.item.title',
        'sections.item.label',
        'sections.item.layout',
        'sections.item.colorScheme',
        'sections.item.includeAgs',
        'sections.item.excludeAgs',
        'sections.item.elements.collection',
        'sections.item.elements.item.*.*.*',
      ],
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
                  console.log(element.item);

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
