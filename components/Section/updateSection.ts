import { Directus } from '@directus/sdk';
import { SectionElement, Section } from '.';

export const updateSection = async (section: Section, token: string) => {
  const directus = new Directus(process.env.NEXT_PUBLIC_DIRECTUS || '');
  const auth = await directus.auth.static(token);
  // console.log('Directus authenticated:', auth);

  const updated = await directus
    .items('sections')
    .updateOne(section.id, section);
  // console.log('Updated:', updated);

  section.render.forEach(async (element: SectionElement) => {
    const updated = await directus
      .items(element.collection)
      .updateOne(element.id, element);
    // console.log('Updated:', updated);
  });
};
