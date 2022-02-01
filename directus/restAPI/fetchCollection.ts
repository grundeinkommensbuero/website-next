import axios from 'axios';

export const fetchCollection = async (collection: string) => {
  // console.log(
  //   'ENV client:',
  //   process.env.NEXT_PUBLIC_DIRECTUS,
  //   'ENV server:',
  //   process.env.DIRECTUS
  // );

  const data = await axios
    .get(
      `${
        process.env.DIRECTUS || process.env.NEXT_PUBLIC_DIRECTUS
      }items/${collection}`
    )
    .then((response) => {
      return response.data.data;
    });
  console.log(data);
  return data;
};
