import Image from 'next/image';
import { ReactElement, useState, useEffect, ReactNode } from 'react';
import { getAssetURL } from './getAssetURL';
import { fetchFileMetadata } from './fetchFileMetadata';

type Layout = 'fill' | 'intrinsic' | 'fixed' | 'responsive';

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
  overrideHeight?: number;
  overrideWidth?: number;
  layout?: Layout;
  parentClassName?: string;
  priority?: boolean;
  [other: string]: any;
};

export const DirectusImage = ({
  assetId,
  className,
  alt,
  overrideHeight,
  overrideWidth,
  layout,
  parentClassName,
  priority,
  ...other
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
    <div className={parentClassName}>
      {imageMeta?.height && imageMeta?.width && (
        <Image
          src={assetURL}
          alt={alt}
          height={
            layout !== 'fill' ? overrideHeight || imageMeta.height : undefined
          }
          width={
            layout !== 'fill' ? overrideWidth || imageMeta.width : undefined
          }
          className={className}
          layout={layout}
          priority={priority}
          {...other}
        />
      )}
    </div>
  );
};
