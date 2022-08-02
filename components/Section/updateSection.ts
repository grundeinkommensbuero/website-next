import { Directus } from '@directus/sdk';
import toast from 'react-hot-toast';
import { SectionElement, Section } from '.';

export const updateSection = async (section: Section, token: string) => {
  const directus = new Directus(process.env.NEXT_PUBLIC_DIRECTUS || '');
  const auth = await directus.auth.static(token);

  await directus
    .items('sections')
    .updateOne(section.id, section)
    .then(() => toast.success(`Section "${section.label}" gespeichert!`))
    .catch(err =>
      toast.error(
        `Bei Sektion "${section.label}" gab es leider einen Fehler!`,
        err
      )
    );

  section.render.forEach(async (element: SectionElement) => {
    await directus
      .items(element.collection)
      .updateOne(element.id, element)
      .then(() => toast.success(`Element "${element.collection}" gespeichert!`))
      .catch(err =>
        toast.error(
          `Bei Element "${element.collection}" gab es leider einen Fehler!`,
          err
        )
      );
  });
};
