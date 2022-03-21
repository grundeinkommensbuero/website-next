// returns the full asset URL for directus
export const getAssetURL = (assetId: string): string => {
  return `${process.env.NEXT_PUBLIC_DIRECTUS}assets/${assetId}`;
};
