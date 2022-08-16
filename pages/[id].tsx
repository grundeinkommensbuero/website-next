import { GetServerSideProps } from 'next';

import React, { ReactElement } from 'react';

import { getPageProps, Page } from '../utils/getPageProps';
import { Section } from '../components/Section';
import { Hero } from '../components/Hero';
import PageNotFound from './404';

export type PageProps = {
  page: Page | null;
};

const PageWithSections = ({ page }: PageProps): ReactElement => {
  if (!page) {
    return <PageNotFound />;
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
        {page.title && <h2 className="my-8">{page.title}</h2>}
      </div>
      {page.sections.map((section: Section) => {
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
      },
    };
  }

  const pageProps = await getPageProps(params.id);

  return {
    props: pageProps,
  };
};

export default PageWithSections;
