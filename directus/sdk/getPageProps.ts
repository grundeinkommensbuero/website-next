import { Directus } from '@directus/sdk';
import {
  Section,
  Layout,
  ColorScheme,
  SectionsImage,
  SectionsComponent,
  SectionsText,
} from '../../components/Section';
import { PageProps } from '../../pages/[id]';

export type Page = {
  slug: string;
  title: string;
  status: string;
  sections: Section[];
};

type FetchedPage = {
  slug: string;
  title: string;
  status: string;
  sections: FetchedSection[];
};

type FetchedSection = {
  pages_slug: {
    sections: FetchedSectionData[];
  };
};

type FetchedSectionData = {
  sort: number;
  item: {
    id: string;
    status: string;
    sort: null | number;
    title: string;
    label: string;
    layout: Layout;
    colorScheme: ColorScheme;
    elements: FetchedElement[];
  };
};

type FetchedElement = {
  collection: 'sectionsText' | 'sectionsImage' | 'sectionsComponent';
  item: {
    id: string;
    status: string;
    sort: number;
    overrideLayout: string | null;
    groupElement: boolean;
    image?: string;
    alt?: string;
    content?: string;
    component?: string;
  };
};

export const getPageProps = async (slug: string): Promise<PageProps> => {
  const directus = new Directus(process.env.DIRECTUS || '');

  try {
    // Get the current page from directus by slug (ID)
    const page = (await directus.items('pages').readOne(slug, {
      fields: [
        'slug',
        'title',
        'status',
        'sections.pages_slug.sections.sort',
        'sections.pages_slug.sections.item.id',
        'sections.pages_slug.sections.item.status',
        'sections.pages_slug.sections.item.sort',
        'sections.pages_slug.sections.item.title',
        'sections.pages_slug.sections.item.label',
        'sections.pages_slug.sections.item.layout',
        'sections.pages_slug.sections.item.colorScheme',
        'sections.pages_slug.sections.item.elements.collection',
        'sections.pages_slug.sections.item.elements.item.*',
      ],
    })) as FetchedPage;

    const finalPage = updatePageStructure(page);

    return {
      page: finalPage,
    };
  } catch (err) {
    console.log(err);
    return {
      page: null,
    };
  }
};

const updatePageStructure = (fetchedPage: FetchedPage): Page => {
  const page = {
    slug: fetchedPage.slug,
    title: fetchedPage.title,
    status: fetchedPage.status,
    sections: fetchedPage.sections[0].pages_slug.sections.map(section => {
      return {
        id: section.item.id,
        title: section.item.title,
        sort: section.item.sort,
        status: section.item.status,
        layout: section.item.layout,
        colorScheme: section.item.colorScheme,
        elements: section.item.elements.map(element => {
          const baseElement = {
            id: element.item.id,
            status: element.item.status,
            sort: element.item.sort,
            overrideLayout: element.item.overrideLayout,
            groupElement: element.item.groupElement,
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
          }
        }),
      };
    }),
  };
  return page;
};
