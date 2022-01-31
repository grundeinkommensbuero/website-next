// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fetchData from '../../../graphql/fetchData';

export type Menuentry = {
  id: string;
  label: string;
  slug: string;
};

const query = `query Mainmenu {
  mainmenu {
    id
    label
    slug
  }
}
`;

const variables = {
  variables: {},
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Menuentry[]>
) {
  const data = await await fetchData(query, variables);
  res.status(200).json(data.data.mainmenu);
}
