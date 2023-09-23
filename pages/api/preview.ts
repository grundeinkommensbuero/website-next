import { Directus } from '@directus/sdk';
import { NextApiRequest, NextApiResponse } from 'next';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === "Berlin";
const IS_HAMBURG_PROJECT = process.env.NEXT_PUBLIC_PROJECT === "Hamburg";

const preview = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check the token and next parameters
  // This token should only be known to this API route and the CMS
  if (
    req.query.token !== process.env.PREVIEW_TOKEN ||
    typeof req.query.slug !== 'string'
  ) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const slug = req.query.slug !== '/' ? req.query.slug 
    : IS_BERLIN_PROJECT
    ? 'start'
    : IS_HAMBURG_PROJECT
    ? 'start-hamburg'
    : 'start-hamburg' //set to start-hamburg on expedition-grundeinkommen.de also temporarily

  // Fetch the headless CMS to check if the provided `slug` exists
  const directus = new Directus(process.env.DIRECTUS || '');

  const page = await directus.items('pages').readOne(slug, {
    fields: ['slug'],
  });

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!page) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to the path from the fetched page
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.redirect(`/${page.slug}`);
};

export default preview;
