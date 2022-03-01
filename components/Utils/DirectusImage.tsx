import Image from 'next/image';
import { ReactElement, useState, useEffect, ReactNode } from 'react';
import { getAssetURL } from '../../utils/getAssetURL';
import { fetchFileMetadata } from '../../directus/restAPI/fetchFileMetadata';

type ImageMeta = {
  width: number | null;
  height: number | null;
  id: string;
  title: string;
};

type DirectusImageProps = {
  assetId: string;
  alt: string;
  className: string;
  fill?: boolean;
};

export const DirectusImage = ({
  assetId,
  className,
  alt,
  fill = false,
}: DirectusImageProps): ReactElement => {
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);

  const assetURL = getAssetURL(assetId);

  useEffect(() => {
    fetchFileMetadata(assetId).then(meta => {
      if (meta) setImageMeta(meta);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {imageMeta?.height && imageMeta?.width && (
        <Image
          src={assetURL}
          alt={alt}
          height={imageMeta.height}
          width={imageMeta.width}
          className={className}
        />
      )}
    </>
  );
};
