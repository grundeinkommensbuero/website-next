import parseHTML from 'html-react-parser';
import s from './style.module.scss';
import classNames from 'classnames';
import { getAssetURL } from '../../Util/getAssetURL';
import { formatDate } from '../../../utils/date';

type BlogProps = {
  title: string;
  content: string;
  assetId: string;
  date: string;
};

export const PostFull = ({ title, content, assetId, date }: BlogProps) => {
  return (
    <>
      {/* <Helmet>
        <title>{title}</title>

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@exbeditionbge" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={htmlToText(excerpt)} />

        {featuredImage && (
          <meta
            property="og:image"
            content={
              featuredImage.node.localFile.childImageSharp.og.images.fallback
                .src
            }
          />
        )}
        {featuredImage && (
          <meta
            name="twitter:image"
            content={
              featuredImage.node.localFile.childImageSharp.og.images.fallback
                .src
            }
          />
        )}
        {!featuredImage && <meta property="og:image" content={OGImage} />}
        {!featuredImage && <meta name="twitter:image" content={OGImage} />}

        <meta name="description" content={htmlToText(excerpt)} />
        <meta property="og:description" content={htmlToText(excerpt)} />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={siteTitle} />
        <meta property="article:published_time" content={date} />
        <meta property="og:type" content="article" />
      </Helmet> */}
      <div className={`overflow-hidden relative`}>
        <div>
          <img
            src={getAssetURL(assetId)}
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
