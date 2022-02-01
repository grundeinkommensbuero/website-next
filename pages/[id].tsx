import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { ReactElement } from 'react';
import fetchData from '../directus/graphql/fetchData';
import { getPageData, Page } from '../directus/graphql/getPageData';
import { fetchCollection } from '../directus/restAPI/fetchCollection';

type PageProps = {
  page: Page;
};

const PageWithSections = ({ page }: PageProps): ReactElement => {
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
  return <h1>{page.title}</h1>;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!(typeof params?.id === 'string')) {
    return {
      props: {
        page: null,
      },
    };
  }

  const currentPage = await getCurrentPage(params.id);
  // const pages = await fetchCollection('pages');
  const pages_sections = await fetchCollection('pages_sections');
  const sections = await fetchCollection('sections');
  const sections_elements = await fetchCollection('sections_elements');

  // console.log('pages:', pages);
  // console.log('pages_sections:', pages_sections);
  console.log('sections:', sections);
  console.log('sections_elements:', sections_elements);

  const currentSections = pages_sections.filter(
    (s: { collection: string; id: number; item: string; pages_slug: string }) =>
      s.pages_slug === currentPage.slug
  );

  console.log('currentPage', currentPage);
  console.log('currentSections', currentSections);

  // const query = `query GetPagesById($params_id: ID!){
  //   pages_by_id(id: $params_id) {
  //     slug
  //     title
  //     sections {
  //       id
  //     }
  //   }
  // }`;

  // const pageData = await fetchData(query, {
  //   variables: {
  //     params_id: params?.id,
  //   },
  // });

  // console.log(pageData.data.pages_by_id.sections);

  // type PagesSection = {
  //   id: string;
  //   pages_slug: string;
  //   item: string;
  //   collection: string;
  // };

  // const pageSections: PagesSection[] = [];
  // pageData.data.pages_by_id.sections.forEach(
  //   async (section: { id: string }) => {
  //     const query_section = `query {
  //     pages_sections_by_id(id: "${section.id}") {
  //       id
  //       collection
  //     }
  //   }`;
  //     const sectionData = await fetchData(query_section, { variables: {} });
  //     pageSections.push(sectionData.data.pages_sections_by_id);
  //     console.log(pageSections);
  //   }
  // );

  if (typeof params?.id === 'string') return getPageData(params.id);
  return {
    props: {
      page: null,
    },
  };
};

const getCurrentPage = async (id: string) => {
  const query = `query GetPagesById($params_id: ID!){
    pages_by_id(id: $params_id) {
      slug
      title
      sections {
        id
      }
    }
  }`;

  const pageData = await fetchData(query, {
    variables: {
      params_id: id,
    },
  });

  return pageData.data.pages_by_id;
};

export default PageWithSections;
