import axios from 'axios';

export const fetchCollection = async (collection: string) => {
  const data = await axios
    .get(
      `${
        process.env.DIRECTUS || process.env.NEXT_PUBLIC_DIRECTUS
      }items/${collection}`
    )
    .then(response => {
      return response.data.data;
    });
  return data;
};
