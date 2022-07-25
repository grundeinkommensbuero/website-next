import React from 'react';
import s from './style.module.scss';
// import { Helmet } from 'react-helmet-async';
import { Blogpost } from '../../../pages/blog';
import { getAssetURL } from '../../Util/getAssetURL';
import Link from 'next/link';
import { formatDate } from '../../../utils/date';

type BlogListProps = { posts: Array<Blogpost> };

export const BlogList = ({ posts }: BlogListProps) => {
  return (
    <div>
      {/* <Helmet>
        <meta
          property="og:image"
          media={getAssetURL('6beccb07-2ea1-4f30-ab86-a99e05a59785')}
        />
      </Helmet> */}
      {posts.map((post, index) => (
        <BlogSnippet key={index} {...post} />
      ))}
    </div>
  );
};

export const BlogSnippet = ({
  title,
  id,
  date,
  teaser,
  featured_image,
}: Blogpost) => {
  const dateObject = new Date(date);
  return (
    <article className={s.article}>
      <header>
        <time dateTime={dateObject.toISOString()}>
          {formatDate(dateObject)}
        </time>
        <h2 className={s.title}>
          <Link href={`/blog/${id}`} passHref>
            {title}
          </Link>
        </h2>
      </header>
      {featured_image && (
        <Link href={`/blog/${id}`} passHref>
          <img
            src={getAssetURL(featured_image.id)}
            alt="Titelbild des Blogeintrags"
            className={s.image}
          />
        </Link>
      )}
      <p className={'pt-4'}>{teaser}</p>
      <p>
        <Link href={`/blog/${id}`} passHref>
          Mehr...
        </Link>
      </p>
    </article>
  );
};
