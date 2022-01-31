import type { NextApiRequest, NextApiResponse } from 'next';
import fetchData from '../../../graphql/fetchData';

export type Blogpost = {
  id: string;
  title: string;
  content: string;
  featured_image: {
    id: string;
  };
};

const query = `query Blogposts {
  blogposts {
    id
    title
    featured_image {
      id
    }
    content
  }
}
`;

const variables = {
  variables: {},
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Blogpost[]>
) {
  const data = await await fetchData(query, variables);
  res.status(200).json(data.data.blogposts);
}
