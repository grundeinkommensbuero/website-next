import { Directus } from '@directus/sdk';
import { SectionElement, Section } from '../../components/Section';

export const updateSection = async (section: Section) => {
  const directus = new Directus(process.env.NEXT_PUBLIC_DIRECTUS || '');
  const auth = await directus.auth.static(
    process.env.NEXT_PUBLIC_FRONTENDKEY || ''
  );
  console.log('Directus authenticated:', auth);

  const updated = await directus
    .items('sections')
    .updateOne(section.id, section);
  console.log('Updated:', updated);

  section.render.forEach(async (element: SectionElement) => {
    const updated = await directus
      .items(element.collection)
      .updateOne(element.id, element);
    console.log('Updated:', updated);
  });
};
