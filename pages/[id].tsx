import { GetServerSideProps } from 'next';

import Link from 'next/link';
import React, { ReactElement } from 'react';

import { getPageProps } from '../utils/getPageProps';
import { Section } from '../components/section';

export type Page = {
  title: string;
  sections: number[];
};

export type PageProps = {
  page: Page | null;
  sections: Section[];
};

export type Element = {
  id: string;
  title: string;
  content: string;
  image: string;
  component: string;
  collection: string;
  sort: number | null;
};

const PageWithSections = ({ page, sections }: PageProps): ReactElement => {
  if (!page) {
    return (
      <div className='text-center'>
        <h2 className='mt-16 mb-4 text-violet'>
          Diese Seite gibt es leider nicht.
        </h2>
        <Link href='/'>
          <a className='text-d-xl' aria-label='Zurück zur Startseite'>
            Zurück zur Startseite
          </a>
        </Link>
      </div>
    );
  }
  return (
    <section>
      {page.title && <h2 className='m-8 text-violet'>{page.title}</h2>}
      {sections.map((section) => {
        return <Section key={section.id} section={section} />;
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

  if (!(typeof params?.id === 'string')) {
    return {
      props: {
        page: null,
        sections: null,
      },
    };
  }

  const pageProps = await getPageProps(params.id);

  return {
    props: pageProps,
  };
};

export default PageWithSections;
