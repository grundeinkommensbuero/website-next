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

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@exbeditionbge" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={teaser} />

        {assetId && (
          <meta property="og:image" content={getRootAssetURL(assetId)} />
        )}
        {assetId && (
          <meta name="twitter:image" content={getRootAssetURL(assetId)} />
        )}
        {!assetId && (
          <meta property="og:image" content={getRootAssetURL(assetId)} />
        )}
        {!assetId && (
          <meta name="twitter:image" content={getRootAssetURL(assetId)} />
        )}

        <meta name="description" content={teaser} />
        <meta property="og:description" content={teaser} />
        <meta property="og:title" content={title} />
        <meta
          property="og:site_name"
          content={'Blogpost der Expedition Grundeinkommen'}
        />
        <meta property="article:published_time" content={date} />
        <meta property="og:type" content="article" />
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
        <div className="px-6 py-8 sections">{parseHTML(content)}</div>
      </div>
    </>
  );
};
