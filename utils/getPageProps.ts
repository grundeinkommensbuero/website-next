import { Directus } from '@directus/sdk';
import { Section } from '../components/Section';
import { Element, Page, PageProps } from '../pages/[id]';

type PagesSection = {
  id: number;
  collection: string;
  item: string;
  status: string;
};

type SectionsElement = {
  collection: string;
  id: number;
  item: string;
  sections_id: string;
  sort: number | null;
};

export const getPageProps = async (slug: string): Promise<PageProps> => {
  const directus = new Directus(process.env.DIRECTUS || '');

  try {
    const page = (await directus.items('pages').readOne(slug)) as Page;

    const sdkPagesSections: PagesSection[] = await Promise.all(
      page.sections.map(
        async (id) =>
          (await directus.items('pages_sections').readOne(id)) as PagesSection
      )
    );

    const _sections: Section[] = await Promise.all(
      sdkPagesSections.map(
        async (section) =>
          (await directus
            .items(section.collection)
            .readOne(section.item)) as Section
      )
    );

    const sections = await Promise.all(
      _sections.map(async (section) => {
        const toRender = await Promise.all(
          section.elements.map(
            async (el) =>
              (await directus
                .items('sections_elements')
                .readOne(el)) as SectionsElement
          )
        );
        const render = await Promise.all(
          toRender.map(async (el) => {
            const element = (await directus
              .items(el.collection)
              .readOne(el.item)) as Element;
            return {
              ...element,
              sort: el.sort || 0,
              collection: el.collection,
            };
          })
        );
        return {
          ...section,
          render: render.sort((a, b) => a.sort - b.sort),
        };
      })
    );

    return {
      page,
      sections,
    };
  } catch (err) {
    console.log(err);
    return {
      page: null,
      sections: [],
    };
  }
};
