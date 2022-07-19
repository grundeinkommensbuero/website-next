import parseHTML from 'html-react-parser';
import { DirectusImage } from '../Util/DirectusImage';
import s from './style.module.scss';
import classNames from 'classnames';
import { getAssetURL } from '../Util/getAssetURL';

type BlogProps = {
  title: string;
  content: string;
  assetId: string;
  date: string;
};

export const PostFull = ({ title, content, assetId, date }: BlogProps) => {
  return (
    <div className={`overflow-hidden relative`}>
      <div>
        <img
          src={getAssetURL(assetId)}
          // assetId={assetId}
          alt="Bild zum Blogpost"
          className={'object-cover h-128 w-full'}
          // overrideHeight={1200}
          // overrideWidth={3000}
        />
        <div className={classNames(s.blogPostHeader, 'h-128')}>
          <div className={classNames('sections', s.blogPostTitle)}>
            <div className={s.postTitleText}>
              <h2 className="text-d-3xl">{title}</h2>
              <p>{new Date(date).toLocaleDateString('de-DE')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-8 sections">{parseHTML(content)}</div>
    </div>
  );
};
