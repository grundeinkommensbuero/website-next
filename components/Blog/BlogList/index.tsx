import React from 'react';
import s from './style.module.scss';
import { Blogpost } from '../../../pages/blog';
import Link from 'next/link';
import { formatDate } from '../../../utils/date';
import { getRootAssetURL } from '../../Util/getRootAssetURL';
import Head from 'next/head';

type BlogListProps = { posts: Array<Blogpost> };

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

export const BlogList = ({ posts }: BlogListProps) => {
  return (
    <div>
      <Head>
        <meta
          key="og:image"
          property="og:image"
          media={getRootAssetURL('6beccb07-2ea1-4f30-ab86-a99e05a59785')}
        />
      </Head>
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
    <article
      className={`s.article ${
        IS_BERLIN_PROJECT ? 'colorSchemeRoseOnWhite' : 'colorSchemeWhite'
      }`}
    >
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
            src={getRootAssetURL(featured_image.id)}
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
