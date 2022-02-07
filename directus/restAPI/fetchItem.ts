import axios from 'axios';

export const fetchItem = async (collection: string, id: string | number) => {
  const data = await axios
    .get(
      `${
        process.env.DIRECTUS || process.env.NEXT_PUBLIC_DIRECTUS
      }items/${collection}/${id}`
    )
    .then((response) => {
      return response.data.data;
    });
  return data;
};
