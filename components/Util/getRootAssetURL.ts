// returns the root asset URL for directus, if available
export const getRootAssetURL = (assetId: string): string => {
  return `${
    process.env.NEXT_PUBLIC_DIRECTUS_ROOT || process.env.NEXT_PUBLIC_DIRECTUS
  }assets/${assetId}`;
};
