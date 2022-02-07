import { GetServerSideProps } from 'next';
import { Directus } from '@directus/sdk';
import Link from 'next/link';
import { ReactElement } from 'react';
import parseHTML from 'html-react-parser';
import Image from 'next/image';
import { getAssetURL } from '../utils/getAssetURL';

type Page = {
  title: string;
  sections: number[];
};

type PageProps = {
  page: Page;
  sections: Section[];
};

type Section = {
  id: string;
  title: string;
  sort: number | null;
  status: string;
  elements: number[];
  render: Element[];
};

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
};

type Element = {
  id: string;
  title: string;
  content: string;
  image: string;
  collection: string;
};

type SectionProps = {
  section: Section;
};

const PageWithSections = ({ page, sections }: PageProps): ReactElement => {
  if (!page) {
    return (
      <div className='text-center'>
        <h2 className='mt-16 mb-4'>Diese Seite gibt es leider nicht.</h2>
        <Link href='/'>
          <a className='text-xl'>Zurück zur Startseite</a>
        </Link>
      </div>
    );
  }
  return (
    <section className='p-8'>
      <h1>{page.title}</h1>
      {sections.map((section) => {
        return <Section key={section.id} section={section} />;
      })}
    </section>
  );
};

const Section = ({ section }: SectionProps): ReactElement => {
  return (
    <section className='py-16'>
      <h2>{section.title}</h2>
      {section.render.map((element) => {
        switch (element.collection) {
          case 'sectionsText':
            return <div key={element.id}>{parseHTML(element.content)}</div>;
          case 'sectionsImage':
            return (
              <Image
                key={element.id}
                src={getAssetURL(element.image)}
                alt='Bild zum Blogpost'
                height={600}
                width={2000}
                className='object-cover h-full w-full'
              />
            );
          default:
            return null;
        }
      })}
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!(typeof params?.id === 'string')) {
    return {
      props: {
        page: null,
        sections: null,
      },
    };
  }

  const directus = new Directus(process.env.DIRECTUS || '');

  const sdkPage = (await directus.items('pages').readOne(params.id)) as Page;

  const sdkPagesSections: PagesSection[] = await Promise.all(
    sdkPage.sections.map(
      async (id) =>
        (await directus.items('pages_sections').readOne(id)) as PagesSection
    )
  );

  const sdkSections: Section[] = await Promise.all(
    sdkPagesSections.map(
      async (section) =>
        (await directus
          .items(section.collection)
          .readOne(section.item)) as Section
    )
  );

  const sectionsWithElements = await Promise.all(
    sdkSections.map(async (section) => {
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
            collection: el.collection,
          };
        })
      );
      return {
        ...section,
        render,
      };
    })
  );

  return {
    props: {
      page: sdkPage,
      sections: sectionsWithElements,
    },
  };
};

export default PageWithSections;
