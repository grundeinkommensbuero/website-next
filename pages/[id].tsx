import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';

import Link from 'next/link';
import React, { ReactElement } from 'react';

import { getPageProps, Page } from '../utils/getPageProps';
import { Section } from '../components/Section';
import { Hero } from '../components/Hero';
import { Directus } from '@directus/sdk';

export type PageProps = {
  page: Page | null;
};

const PageWithSections = ({ page }: PageProps): ReactElement => {
  if (!page) {
    return (
      <div className="text-center">
        <h2 className="mt-16 mb-4 text-violet">
          Diese Seite gibt es leider nicht.
        </h2>
        <Link href="/">
          <a className="text-d-xl" aria-label="Zurück zur Startseite">
            Zurück zur Startseite
          </a>
        </Link>
      </div>
    );
  }
  return (
    <section>
      {page.hasHero && page.heroImage && (
        <Hero
          heroTitle={page.heroTitle}
          heroSubTitle={page.heroSubTitle}
          heroImage={page.heroImage}
        />
      )}
      <div className="pageWidth">
        {page.title && <h2 className="px-4 my-8">{page.title}</h2>}
      </div>
      {page.sections.map((section: Section) => {
        return <Section key={section.id} section={section} />;
      })}
    </section>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const directus = new Directus(process.env.DIRECTUS || '');

  try {
    const pages = (await directus.items('pages').readByQuery({
      fields: ['slug'],
      filter: {
        status: {
          _eq: 'published',
        },
        slug: {
          _eq: 'start',
        },
      },
    })) as Page[];

    return {
      paths: pages.map(({ slug }) => ({ params: { id: slug } })),
      fallback: false,
    };
  } catch (err) {
    console.log(err);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!(typeof params?.id === 'string')) {
    return {
      props: {
        page: null,
      },
    };
  }

  const pageProps = await getPageProps(params.id);

  return {
    props: pageProps,
  };
};

export default PageWithSections;
