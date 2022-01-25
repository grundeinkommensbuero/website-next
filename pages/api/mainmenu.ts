// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
  id: number;
  status: string;
  sort: null;
  user_updated: null;
  date_updated: null;
  label: string;
  slug: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Promise<Data>>
) {
  const data = await axios
    .get(`${process.env.DIRECTUS}items/mainmenu`)
    .then((response) => {
      return response.data.data;
    });
  res.status(200).json(data);
}
