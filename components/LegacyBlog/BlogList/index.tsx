import React from 'react';
import s from './style.module.scss';
import { Helmet } from 'react-helmet-async';
import { formatDate } from '../../../utils/formatDate';
import { Blogpost } from '../../../pages/blog';
import { getAssetURL } from '../../Util/getAssetURL';
import Link from 'next/link';
import { DirectusImage } from '../../Util/DirectusImage';

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

export const BlogSnippet = ({ title, id, date, featured_image }: Blogpost) => {
  const dateObject = new Date(date);
  return (
    <article className={s.article}>
      <header>
        <time dateTime={dateObject.toISOString()}>
          {formatDate(dateObject)}
        </time>
        <h2 className={s.title}>
          <Link href={`/blog/${id}`} passHref>
            <h2>{title}</h2>
          </Link>
        </h2>
      </header>
      {featured_image && (
        <Link href={`/blog/${id}`} passHref>
          <DirectusImage
            className={s.image}
            alt="Titelbild des Blogeintrags"
            assetId={featured_image.id}
          />
        </Link>
      )}
      {/* <div
        className={s.body}
        dangerouslySetInnerHTML={{
          __html: excerpt,
        }}
      />
      <p>
        <Link href={`/blog/${id}`} passHref>
          Mehr...
        </Link>
      </p> */}
    </article>
  );
};
