import parseHTML from 'html-react-parser';
import s from './style.module.scss';
import classNames from 'classnames';
import { formatDate } from '../../../utils/date';
import { getRootAssetURL } from '../../Util/getRootAssetURL';
import Head from 'next/head';

type BlogProps = {
  title: string;
  content: string;
  teaser: string;
  assetId: string;
  date: string;
};

export const PostFull = ({
  title,
  content,
  teaser,
  assetId,
  date,
}: BlogProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>

        <meta
          key="twitter:card"
          name="twitter:card"
          content="summary_large_image"
        />
        <meta key="twitter:site" name="twitter:site" content="@exbeditionbge" />
        <meta key="twitter:title" name="twitter:title" content={title} />
        <meta
          key="twitter:description"
          name="twitter:description"
          content={teaser}
        />

        {assetId && (
          <meta
            key="og:image"
            property="og:image"
            content={getRootAssetURL(assetId)}
          />
        )}
        {assetId && (
          <meta
            key="twitter:image"
            name="twitter:image"
            content={getRootAssetURL(assetId)}
          />
        )}
        {!assetId && (
          <meta
            key="og:image"
            property="og:image"
            content={getRootAssetURL(assetId)}
          />
        )}
        {!assetId && (
          <meta
            key="twitter:image"
            name="twitter:image"
            content={getRootAssetURL(assetId)}
          />
        )}

        <meta key="description" name="description" content={teaser} />
        <meta key="og:description" property="og:description" content={teaser} />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:site_name"
          property="og:site_name"
          content={'Blogpost der Expedition Grundeinkommen'}
        />
        <meta
          key="article:published_time"
          property="article:published_time"
          content={date}
        />
        <meta key="og:type" property="og:type" content="article" />
      </Head>
      <div className={`overflow-hidden relative`}>
        <div>
          <img
            src={getRootAssetURL(assetId)}
            alt="Bild zum Blogpost"
            className={'object-cover h-128 w-full'}
          />
          <div className={classNames(s.blogPostHeader, 'h-128')}>
            <div className={classNames('sections', s.blogPostTitle)}>
              <div className={s.postTitleText}>
                <h2 className="text-d-3xl">{title}</h2>
                <p>{formatDate(new Date(date))}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-8 sections overflow-hidden">
          {parseHTML(content)}
        </div>
      </div>
    </>
  );
};
