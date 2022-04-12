import { Directus } from '@directus/sdk';
import {
  Section,
  Layout,
  ColorScheme,
  SectionsImage,
  SectionsComponent,
  SectionsText,
  SectionsVideo,
} from '../components/Section';
import { PageProps } from '../pages/[id]';

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
  sections: FetchedSectionData[];
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
  collection:
    | 'sectionsText'
    | 'sectionsImage'
    | 'sectionsComponent'
    | 'sectionsVideo';
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
    embedId?: string;
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
        'sections.sort',
        'sections.item.id',
        'sections.item.status',
        'sections.item.sort',
        'sections.item.title',
        'sections.item.label',
        'sections.item.layout',
        'sections.item.colorScheme',
        'sections.item.elements.collection',
        'sections.item.elements.item.*',
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
    sections: fetchedPage.sections.map(section => {
      return {
        id: section.item.id,
        title: section.item.title,
        label: section.item.label,
        sort: section.item.sort,
        status: section.item.status,
        layout: section.item.layout,
        colorScheme: section.item.colorScheme,
        render: section.item.elements.map((element, index) => {
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
          }
        }),
      };
    }),
  };
};
