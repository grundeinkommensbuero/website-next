import fetchData from './fetchData';

export type Page = {
  title: string;
};

export const getPageData = async (slug: string) => {
  const query = `query {
    pages_by_id(id: "${slug}") {
      slug
      title
    }
  }`;

  const variables = {
    variables: {},
  };

  const page: Promise<Page> = await fetchData(query, variables).then((data) => {
    return data.data.pages_by_id;
  });

  return {
    props: {
      page,
    },
  };
};
