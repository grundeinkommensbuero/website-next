import { GetServerSideProps } from 'next';

import Link from 'next/link';
import React, { ReactElement } from 'react';

import { getPageProps, Page } from '../utils/getPageProps';
import { Section } from '../components/Section';
import { withAuthSSR } from '../components/Util/withAuthSSR';
import { withAuth } from '../components/Util/withAuth';
import { Layout } from '../layout';
import { Mainmenu } from '../utils/getMenus';

export type PageProps = {
  page: Page | null;
};

const PageWithSections = ({
  page,
  mainmenu,
}: PageProps & { mainmenu: Mainmenu }): ReactElement => {
  if (!page) {
    return (
      <Layout mainmenu={mainmenu}>
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
      </Layout>
    );
  }
  return (
    <Layout mainmenu={mainmenu}>
      <section>
        <div className="pageWidth">
          {page.title && <h2 className="text-violet my-8">{page.title}</h2>}
        </div>
        {page.sections.map((section: Section) => {
          return <Section key={section.id} section={section} />;
        })}
      </section>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = withAuthSSR(
  async ({ params, res }) => {
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
  }
);

export default withAuth(PageWithSections);
