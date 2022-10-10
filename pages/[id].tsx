import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';

import React, { ReactElement } from 'react';

import { getPageProps, Page } from '../utils/getPageProps';
import { Section } from '../components/Section';
import { Hero } from '../components/Hero';
import { Directus } from '@directus/sdk';
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
      {page.sections.map((section: Section, index: number) => {
        console.log('index of section', index);

        return (
          <Section
            key={section.id}
            section={section}
            isFirstSection={index === 0}
          />
        );
      })}
    </section>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const directus = new Directus(process.env.DIRECTUS || '');

  try {
    const pages = (
      await directus.items('pages').readByQuery({
        fields: ['slug'],
        filter: {
          status: {
            _eq: 'published',
          },
          slug: {
            _neq: 'start',
          },
        },
      })
    ).data as Page[] | null | undefined;

    return {
      paths: pages?.map(({ slug }) => ({ params: { id: slug } })) || [],
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
