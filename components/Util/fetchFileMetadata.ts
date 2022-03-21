import axios from 'axios';

export const fetchFileMetadata = async (assetId: string) => {
  const data = await axios
    .get(
      `${
        process.env.DIRECTUS || process.env.NEXT_PUBLIC_DIRECTUS
      }files/${assetId}`
    )
    .then(response => {
      return response.data.data;
    });
  return data;
};
