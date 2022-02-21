import { Directus } from '@directus/sdk';

export const getFileMetadata = async (assetId: string) => {
  const directus = new Directus(process.env.NEXT_PUBLIC_DIRECTUS || '');

  const fileMeta = await directus.items('directus_files').readOne(assetId);

  console.log(fileMeta);

  return fileMeta;
};
