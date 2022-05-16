import { GetServerSideProps } from 'next';

import Link from 'next/link';
import React, { ReactElement } from 'react';

import { getPageProps, Page } from '../../utils/getPageProps';
import { Section } from '../../components/Section';

import municipalities from '../../content/municipalities.json';
import { Municipality } from '../../context/Municipality';

export type PageProps = {
  page: Page | null;
  ags: string;
};

const PageWithSections = ({ page, ags }: PageProps): ReactElement => {
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
      <div className="pageWidth">
        {page.title && <h2 className="text-violet my-8">{page.title}</h2>}
      </div>
      {page.sections.map((section: Section) => {
        // Check if section should be rendered for this municipality
        // depending on the includeAgs and excludeAgs arrays
        if (
          section.includeAgs.includes(ags) ||
          !section.excludeAgs.includes(ags)
        ) {
          return <Section key={section.id} section={section} />;
        }
      })}
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${60 * 60}, stale-while-revalidate=${59}`
  );

  if (typeof params?.slug !== 'string') {
    return {
      props: {
        page: null,
      },
    };
  }

  const pageProps = await getPageProps('orte');

  const municipality: Municipality | undefined = municipalities.find(
    ({ slug }) => params.slug === slug
  );

  const ags = municipality?.ags;

  return {
    props: {
      ...pageProps,
      ags,
    },
  };
};

export default PageWithSections;
